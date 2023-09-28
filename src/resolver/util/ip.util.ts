import { isIP as NetIsIp } from 'net';
import { Netmask } from 'netmask';

const blocks = [
  new Netmask('10.0.0.0/8'),
  new Netmask('100.64.0.0/10'),
  new Netmask('172.16.0.0/12'),
  new Netmask('192.168.0.0/16'),
];

export { isIPv4, isIPv6 } from 'net';

export const isIP = (ip: string): boolean => NetIsIp(ip) > 0;

export function isPrivate(ip: string): boolean {
  for (const block of blocks) {
    if (NetIsIp(ip) === 4 && block.contains(ip)) {
      return true;
    }
  }

  return false;
}

export function isPublic(ip: string): boolean {
  return !isPrivate(ip);
}

/**
 * Очищает список от приватных адресов и удаляет дубли
 */
export function getUniquePublicList(ips: string[]): string[] {
  return [...new Set(ips)].filter((ip) => isPublic(ip));
}
