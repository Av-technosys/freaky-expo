const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();

export const hasGoogleMapsKey = () => Boolean(GOOGLE_MAPS_API_KEY);

export type GooglePlacePrediction = {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

export type GoogleAddress = {
  formattedAddress: string;
  addressLineOne: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
};

type GoogleAddressComponent = { long_name?: string; types?: string[] };
type GooglePlaceResult = {
  formatted_address?: string;
  address_components?: GoogleAddressComponent[];
  geometry?: { location?: { lat?: number; lng?: number } };
};

function requireApiKey() {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key is missing. Restart Expo after updating .env.');
  }

  return GOOGLE_MAPS_API_KEY;
}

function valueFor(components: GoogleAddressComponent[], type: string) {
  return components.find((component) => component.types?.includes(type))?.long_name ?? '';
}

export function normaliseGoogleAddress(result: GooglePlaceResult): GoogleAddress {
  const components = result.address_components ?? [];
  const streetNumber = valueFor(components, 'street_number');
  const route = valueFor(components, 'route');
  const addressLineOne = [streetNumber, route].filter(Boolean).join(' ') || result.formatted_address || '';

  return {
    formattedAddress: result.formatted_address ?? '',
    addressLineOne,
    city: valueFor(components, 'locality') || valueFor(components, 'sublocality') || valueFor(components, 'administrative_area_level_2'),
    state: valueFor(components, 'administrative_area_level_1'),
    postalCode: valueFor(components, 'postal_code'),
    country: valueFor(components, 'country'),
    latitude: result.geometry?.location?.lat ?? 0,
    longitude: result.geometry?.location?.lng ?? 0,
  };
}

export async function searchGooglePlaces(input: string): Promise<GooglePlacePrediction[]> {
  if (input.trim().length < 2) return [];

  const key = requireApiKey();
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input.trim())}&key=${key}&components=country:in`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || (data.status !== 'OK' && data.status !== 'ZERO_RESULTS')) {
    throw new Error(data.error_message || 'Unable to search places');
  }

  return data.predictions ?? [];
}

export async function getGooglePlaceAddress(placeId: string): Promise<GoogleAddress> {
  const key = requireApiKey();
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=formatted_address,address_component,geometry&key=${key}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || data.status !== 'OK' || !data.result) {
    throw new Error(data.error_message || 'Unable to load place details');
  }

  return normaliseGoogleAddress(data.result);
}

export async function reverseGeocodeGoogleLocation(latitude: number, longitude: number): Promise<GoogleAddress> {
  const key = requireApiKey();
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || data.status !== 'OK' || !data.results?.[0]) {
    throw new Error(data.error_message || 'Unable to resolve current location');
  }

  return normaliseGoogleAddress(data.results[0]);
}

export function googleStaticMapUrl(latitude: number, longitude: number) {
  const key = requireApiKey();
  return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=16&size=700x420&scale=2&markers=color:0xff5a2a%7C${latitude},${longitude}&key=${key}`;
}
