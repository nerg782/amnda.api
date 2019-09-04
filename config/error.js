module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const error = CanoError.handler(err);
    cano.log.error('-->', error.original);
    ctx.response.body = error.fullContent;
    ctx.response.status = error.status;
  }
};
