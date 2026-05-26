const NEWS_TYPES = new Set(['NEWS', 'CAMPAIGN', 'RALLY']);
const MEMBER_STATUSES = new Set(['PENDING', 'ACTIVE', 'REJECTED']);

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeOptionalUrl(value) {
  const raw = normalizeText(value);
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { error: 'URL must start with http:// or https://' };
    }
    return url.toString();
  } catch {
    return { error: 'Invalid URL format' };
  }
}

export function validateNewsPayload(payload) {
  const title = normalizeText(payload.title);
  const content = normalizeText(payload.content);
  const type = normalizeText(payload.type || 'NEWS').toUpperCase();

  if (title.length < 5 || title.length > 140) {
    return { ok: false, error: 'Title must be between 5 and 140 characters' };
  }

  if (content.length < 20 || content.length > 5000) {
    return { ok: false, error: 'Content must be between 20 and 5000 characters' };
  }

  if (!NEWS_TYPES.has(type)) {
    return { ok: false, error: 'Invalid news type' };
  }

  const imageUrl = normalizeOptionalUrl(payload.imageUrl);
  if (imageUrl?.error) return { ok: false, error: `Image URL: ${imageUrl.error}` };

  const videoUrl = normalizeOptionalUrl(payload.videoUrl);
  if (videoUrl?.error) return { ok: false, error: `Video URL: ${videoUrl.error}` };

  return {
    ok: true,
    data: {
      title,
      content,
      type,
      imageUrl,
      videoUrl,
      isPublished: Boolean(payload.isPublished),
    },
  };
}

export function validateEventPayload(payload) {
  const title = normalizeText(payload.title);
  const description = normalizeText(payload.description);
  const location = normalizeText(payload.location);
  const dateInput = normalizeText(payload.date);
  const date = new Date(dateInput);

  if (title.length < 5 || title.length > 140) {
    return { ok: false, error: 'Event title must be between 5 and 140 characters' };
  }

  if (description.length < 20 || description.length > 3000) {
    return { ok: false, error: 'Description must be between 20 and 3000 characters' };
  }

  if (location.length < 3 || location.length > 180) {
    return { ok: false, error: 'Location must be between 3 and 180 characters' };
  }

  if (!dateInput || Number.isNaN(date.getTime())) {
    return { ok: false, error: 'Invalid event date and time' };
  }

  const registrationUrl = normalizeOptionalUrl(payload.registrationUrl);
  if (registrationUrl?.error) return { ok: false, error: `Registration URL: ${registrationUrl.error}` };

  return {
    ok: true,
    data: {
      title,
      description,
      date,
      location,
      isOnline: Boolean(payload.isOnline),
      registrationUrl,
    },
  };
}

export function validateMemberStatus(status) {
  const normalized = normalizeText(status).toUpperCase();
  if (!MEMBER_STATUSES.has(normalized)) {
    return { ok: false, error: 'Invalid member status' };
  }
  return { ok: true, value: normalized };
}
