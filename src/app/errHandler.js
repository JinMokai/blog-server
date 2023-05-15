module.exports = (err, ctx) => {
    let status = 500
    ctx.status = status
    ctx.body = err
    console.error(err)
  }
  