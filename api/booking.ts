import { privateApi } from './axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'


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


export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBooking,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      })
    },
  })
}

export const useAddItemToBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addItemToBooking,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      })
    },
  })
}
