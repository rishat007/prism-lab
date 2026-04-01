/**
 * Site Controller - Nav and settings from /api/site (uses DB when configured)
 */
import { useState, useEffect } from 'react';
import { siteModel } from '../models/api.js';

const DEFAULT_NAVBAR = [
  { id: 1, label: 'Home', path: '/', children: [] },
  { id: 2, label: 'PRISM Lab', path: '/prism-lab', children: [] },
  { id: 3, label: 'Research', path: '/research', children: [
    { id: 4, label: 'Overview', path: '/research', children: [] },
    { id: 5, label: 'Research areas', path: '/research/areas', children: [] },
    { id: 6, label: 'Projects', path: '/research/projects', children: [] },
  ]},
  { id: 7, label: 'Teaching', path: '/teaching', children: [
    { id: 8, label: 'Overview', path: '/teaching', children: [] },
    { id: 9, label: 'Courses', path: '/teaching/courses', children: [] },
    { id: 10, label: 'Materials', path: '/teaching/materials', children: [] },
  ]},
  { id: 11, label: 'Publications', path: '/publications', children: [] },
  { id: 12, label: 'Grants', path: '/grants', children: [] },
  { id: 13, label: 'Students', path: '/students', children: [] },
  { id: 14, label: 'Contact', path: '/contact', children: [] },
];

const DEFAULT_SIDEBAR = [
  { id: 1, label: 'Home', path: '/', children: [] },
  { id: 2, label: 'PRISM Lab', path: '/prism-lab', children: [] },
  { id: 3, label: 'Research', path: '/research', children: [
    { id: 4, label: 'Research areas', path: '/research/areas', children: [] },
    { id: 5, label: 'Projects', path: '/research/projects', children: [] },
  ]},
  { id: 6, label: 'Teaching', path: '/teaching', children: [
    { id: 7, label: 'Courses', path: '/teaching/courses', children: [] },
    { id: 8, label: 'Materials', path: '/teaching/materials', children: [] },
  ]},
  { id: 9, label: 'Publications', path: '/publications', children: [] },
  { id: 10, label: 'Grants', path: '/grants', children: [] },
  { id: 11, label: 'Students', path: '/students', children: [] },
  { id: 12, label: 'Contact', path: '/contact', children: [] },
];

export function useSiteController() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    siteModel
      .getData()
      .then((res) => {
        if (res?.nav) setData(res);
        else setData({ nav: { navbar: DEFAULT_NAVBAR, sidebar: DEFAULT_SIDEBAR }, settings: {} });
      })
      .catch(() => {
        setData({ nav: { navbar: DEFAULT_NAVBAR, sidebar: DEFAULT_SIDEBAR }, settings: {} });
      })
      .finally(() => setLoading(false));
  }, []);

  const navbar = data?.nav?.navbar ?? DEFAULT_NAVBAR;
  const sidebar = data?.nav?.sidebar ?? DEFAULT_SIDEBAR;
  const settings = data?.settings ?? {};

  return { data, navbar, sidebar, settings, loading };
}
