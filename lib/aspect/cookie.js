module.exports = async function (ctx, next) {
  const {req} = ctx;
  const cookieStr = decodeURIComponent(req.headers.cookie);
  const cookies = cookieStr.split(/\s*;\s*/);
  ctx.cookies = {};
  cookies.forEach((cookie) => {
    const [key, value] = cookie.split('=');
    ctx.cookies[key] = value;
  });
  await next();
};
