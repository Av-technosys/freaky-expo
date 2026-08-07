import { privateApi } from './axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingStatus = 'HOLD' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type BookingFilterGroup = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type BookingItem = {
  bookingId: number;
  userId: string;
  eventTypeId: number | null;
  source: string;
  contactName: string | null;
  contactNumber: string | null;
  description: string | null;
  startTime: string | null;
  endTime: string | null;
  bookingStatus: BookingStatus;
  paymentStatus: string;
  totalAmount: number | null;
  vendorId: number | null;
  vendorName: string | null;
  vendorLogo: string | null;
  createdAt: string;
};

export type GroupedBookings = {
  upcoming: BookingItem[];
  ongoing: BookingItem[];
  completed: BookingItem[];
  cancelled: BookingItem[];
};

// ─── Status helpers ───────────────────────────────────────────────────────────

const statusToGroup = (status: BookingStatus): BookingFilterGroup => {
  switch (status) {
    case 'HOLD':
    case 'CONFIRMED':
      return 'upcoming';
    case 'IN_PROGRESS':
      return 'ongoing';
    case 'COMPLETED':
      return 'completed';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return 'upcoming';
  }
};

// ─── API calls ────────────────────────────────────────────────────────────────

export const createBooking = async (payload: any) => {
  const response = await privateApi.post('/booking/booking', payload)
  return response.data
}

export const addItemToBooking = async (payload: any) => {
  const response = await privateApi.post('/booking/bookingItem', payload)
  return response.data
}

export const fetchBookings = async (completed: boolean) => {
  const response = await privateApi.get('/booking/my-bookings', {
    params: { completed },
  })
  return response.data
}

export const fetchMyBookings = async () => {
  const res = await privateApi.get('/booking/my-bookings')
  return res.data
}

export const fetchBookingbyId = async (id: string) => {
  const response = await privateApi.get(`/booking/${id}`)
  return response.data
}

/** Fetches both active and completed bookings in parallel and merges them. */
export const fetchAllMyBookings = async (): Promise<BookingItem[]> => {
  const [activeRes, completedRes] = await Promise.all([
    privateApi.get('/booking/my-bookings'),
    privateApi.get('/booking/my-bookings', { params: { completed: true } }),
  ]);
  return [
    ...(activeRes.data?.data ?? []),
    ...(completedRes.data?.data ?? []),
  ];
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: fetchMyBookings,
  })
}

export const useBookings = (completed: boolean) => {
  return useQuery({
    queryKey: ['bookings', completed],
    queryFn: () => fetchBookings(completed),
  })
}

export const useBookingById = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => fetchBookingbyId(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

/** Fetches all bookings and returns them grouped by status for the Manage screen. */
export const useGroupedBookings = () => {
  return useQuery<BookingItem[], Error, GroupedBookings>({
    queryKey: ['bookings-grouped'],
    queryFn: fetchAllMyBookings,
    staleTime: 1000 * 60 * 2,
    select: (bookings) => {
      const grouped: GroupedBookings = { upcoming: [], ongoing: [], completed: [], cancelled: [] };
      for (const b of bookings) {
        grouped[statusToGroup(b.bookingStatus)].push(b);
      }
      return grouped;
    },
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['bookings-grouped'] })
    },
  })
}

export const useAddItemToBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addItemToBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['bookings-grouped'] })
    },
  })
}
