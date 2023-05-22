module.exports = (err, ctx) => {
    let status = 500
    switch (err.code) {
      case "1002":
        // 没有权限
        status = 403
        break
      default:
        status = 500
    }
    ctx.status = status
    ctx.body = err
    console.error(err)
  }
  