import { SuperfaceClient } from '@superfaceai/one-sdk';

const sdk = new SuperfaceClient();

export async function getAddressFromIp(ip) {
  // Load the profile
  const profile = await sdk.getProfile('address/ip-geolocation@1.0.1');

  // Use the profile
  const result = await profile.getUseCase('IpGeolocation').perform(
    {
      ipAddress: ip,
    },
    {
      provider: 'ipdata',
      security: {
        apikey: {
          apikey: 'e7672a5b3e0195fdd379dfa644649d361176ff875ea7387571fa54bc',
        },
      },
    },
  );

  try {
    return result.unwrap();
  } catch (error) {
    return '';
  }
}
