const sgMail = require('../config/sendgrid');

exports.sendEmailAlert = async (user, article) => {
  try {
    const msg = {
      to: user.email,
      from: {
        email: process.env.EMAIL_FROM,
        name: 'NewsAlert'
      },
      subject: `Breaking: ${article.title.slice(0, 80)}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h1 style="font-size:20px;color:#1a1a2e;margin-bottom:8px">
            ${article.title}
          </h1>
          ${article.urlToImage
            ? `<img src="${article.urlToImage}" alt="" style="width:100%;border-radius:8px;margin-bottom:16px"/>`
            : ''
          }
          <p style="color:#555;line-height:1.6">${article.description || ''}</p>
          <p style="font-size:13px;color:#888">
            Source: ${article.source} &nbsp;|&nbsp;
            Category: ${article.category}
          </p>
          <a href="${article.url}"
            style="display:inline-block;margin-top:16px;background:#4f46e5;color:#fff;
                   padding:10px 24px;border-radius:6px;text-decoration:none;font-size:14px">
            Read Full Article
          </a>
          <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
          <p style="font-size:12px;color:#aaa">
            You're receiving this because you subscribed to ${article.category} alerts.
            Manage your <a href="${process.env.FRONTEND_URL}/preferences">preferences here</a>.
          </p>
        </div>
      `
    };
    await sgMail.send(msg);
  } catch (err) {
    console.error('SendGrid error:', err.response?.body || err.message);
  }
};

exports.sendDigestEmail = async (user, articles) => {
  try {
    const articleRows = articles.map(a => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee">
          <a href="${a.url}" style="font-size:15px;color:#1a1a2e;text-decoration:none;font-weight:500">
            ${a.title}
          </a>
          <p style="font-size:13px;color:#888;margin:4px 0 0">
            ${a.source} · ${a.category}
          </p>
        </td>
      </tr>
    `).join('');

    await sgMail.send({
      to: user.email,
      from: { email: process.env.EMAIL_FROM, name: 'NewsAlert' },
      subject: `Your news digest — ${new Date().toLocaleDateString()}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#1a1a2e">Your News Digest</h2>
          <table style="width:100%;border-collapse:collapse">
            ${articleRows}
          </table>
          <p style="font-size:12px;color:#aaa;margin-top:24px">
            Manage your <a href="${process.env.FRONTEND_URL}/preferences">preferences here</a>.
          </p>
        </div>
      `
    });
  } catch (err) {
    console.error('Digest email error:', err.response?.body || err.message);
  }
};