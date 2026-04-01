/**
 * Static API Model - reads frozen JSON payloads from public/static-data
 */
const DATA_BASE = './static-data';

const ENDPOINT_TO_FILE = {
  '/home': 'home.json',
  '/resume': 'resume.json',
  '/research': 'research.json',
  '/teaching': 'teaching.json',
  '/publications': 'publications.json',
  '/grants': 'grants.json',
  '/prism': 'prism.json',
  '/students': 'students.json',
  '/contact': 'contact.json',
  '/hero': 'hero.json',
  '/site': 'site.json',
  '/social': 'social.json',
};

function normalizeMediaUrls(value) {
  if (Array.isArray(value)) return value.map(normalizeMediaUrls);
  if (value && typeof value === 'object') {
    const next = {};
    for (const [key, val] of Object.entries(value)) {
      next[key] = normalizeMediaUrls(val);
    }
    return next;
  }
  if (typeof value === 'string' && value.startsWith('/uploads/')) {
    return `.${value}`;
  }
  return value;
}

async function request(endpoint) {
  const fileName = ENDPOINT_TO_FILE[endpoint];
  if (!fileName) {
    throw new Error(`Unknown static endpoint: ${endpoint}`);
  }

  let res;
  try {
    res = await fetch(`${DATA_BASE}/${fileName}`);
  } catch (err) {
    throw err;
  }

  if (!res.ok) {
    throw new Error(`Static data error: ${res.status} (${fileName})`);
  }

  const json = await res.json().catch(() => ({}));
  return normalizeMediaUrls(json);
}

export const homeModel = {
  getData: () => request('/home'),
};

export const resumeModel = {
  getData: () => request('/resume'),
};

export const researchModel = {
  getData: () => request('/research'),
};

export const teachingModel = {
  getData: () => request('/teaching'),
};

export const publicationModel = {
  getData: () => request('/publications'),
};

export const grantModel = {
  getData: () => request('/grants'),
};

export const prismModel = {
  getData: () => request('/prism'),
};

export const studentModel = {
  getData: () => request('/students'),
};

export const contactModel = {
  getData: () => request('/contact'),
};

export const heroModel = {
  getData: () => request('/hero'),
};

export const siteModel = {
  getData: () => request('/site'),
};
