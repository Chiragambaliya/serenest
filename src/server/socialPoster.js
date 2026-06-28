/**
 * Social media publishing service.
 * Handles LinkedIn (company page) and Instagram (Graph API) posting.
 * Credentials come from environment variables — never hardcoded.
 */

const LI_TOKEN   = process.env.LINKEDIN_ACCESS_TOKEN;
const LI_ORG     = process.env.LINKEDIN_ORG_URN;          // e.g. urn:li:organization:12345678
const IG_TOKEN   = process.env.INSTAGRAM_ACCESS_TOKEN;
const IG_USER_ID = process.env.INSTAGRAM_USER_ID;         // numeric IG Business account ID

// ─── LinkedIn ────────────────────────────────────────────────────────────────

async function postToLinkedIn(caption, hashtags, imageUrl) {
  if (!LI_TOKEN || !LI_ORG) throw new Error('LinkedIn credentials not configured');

  const text = hashtags ? `${caption}\n\n${hashtags}` : caption;

  const body = {
    author: LI_ORG,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };

  // If image provided, upload it first then attach
  if (imageUrl) {
    const asset = await uploadLinkedInImage(imageUrl);
    body.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
    body.specificContent['com.linkedin.ugc.ShareContent'].media = [{
      status: 'READY',
      description: { text: caption.slice(0, 200) },
      media: asset,
      title: { text: 'Serenest' },
    }];
  }

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LI_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LinkedIn API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.id;
}

async function uploadLinkedInImage(imageUrl) {
  // Step 1 — register upload
  const regRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: LI_ORG,
        serviceRelationships: [{
          relationshipType: 'OWNER',
          identifier: 'urn:li:userGeneratedContent',
        }],
      },
    }),
  });

  if (!regRes.ok) throw new Error('LinkedIn image registration failed');
  const regData = await regRes.json();
  const uploadUrl = regData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
  const asset = regData.value.asset;

  // Step 2 — fetch image bytes and upload
  const imgRes = await fetch(imageUrl);
  const imgBuf = await imgRes.arrayBuffer();
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${LI_TOKEN}` },
    body: imgBuf,
  });

  return asset;
}

// ─── Instagram ────────────────────────────────────────────────────────────────

async function postToInstagram(caption, hashtags, imageUrl) {
  if (!IG_TOKEN || !IG_USER_ID) throw new Error('Instagram credentials not configured');
  if (!imageUrl) throw new Error('Instagram requires an image URL');

  const text = hashtags ? `${caption}\n\n${hashtags}` : caption;

  // Step 1 — create media container
  const createRes = await fetch(
    `https://graph.instagram.com/${IG_USER_ID}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: text,
        access_token: IG_TOKEN,
      }),
    }
  );

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Instagram container error ${createRes.status}: ${err}`);
  }

  const { id: creationId } = await createRes.json();

  // Brief pause — Meta recommends waiting before publish
  await new Promise((r) => setTimeout(r, 3000));

  // Step 2 — publish
  const pubRes = await fetch(
    `https://graph.instagram.com/${IG_USER_ID}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: IG_TOKEN,
      }),
    }
  );

  if (!pubRes.ok) {
    const err = await pubRes.text();
    throw new Error(`Instagram publish error ${pubRes.status}: ${err}`);
  }

  const { id } = await pubRes.json();
  return id;
}

// ─── Unified publish ─────────────────────────────────────────────────────────

/**
 * Publishes a post to the specified platform(s).
 * Returns { linkedin_post_id?, instagram_post_id?, errors: string[] }
 */
export async function publishPost({ platform, caption, hashtags, image_url }) {
  const results = { linkedin_post_id: null, instagram_post_id: null, errors: [] };

  if (platform === 'linkedin' || platform === 'both') {
    try {
      results.linkedin_post_id = await postToLinkedIn(caption, hashtags, image_url);
    } catch (e) {
      results.errors.push(`LinkedIn: ${e.message}`);
    }
  }

  if (platform === 'instagram' || platform === 'both') {
    try {
      results.instagram_post_id = await postToInstagram(caption, hashtags, image_url);
    } catch (e) {
      results.errors.push(`Instagram: ${e.message}`);
    }
  }

  return results;
}

export function credentialStatus() {
  return {
    linkedin: !!(LI_TOKEN && LI_ORG),
    instagram: !!(IG_TOKEN && IG_USER_ID),
  };
}
