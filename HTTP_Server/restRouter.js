const url = require("url");
const userData= require('./routes/userRoutes')
const {getData,getTextOrJsonData,getXMLdata,getFormData} =require('./utils/getBody')
const response=require('./utils/response')

class RestRouter {
  constructor(router) {
    this.router = router;
  }

  init() {
    userData(this.router);

    return async (req, res) => {
      switch (req.method.toUpperCase()) {
        case "GET":
          this.handleReq(req, res, this.router.getRoutes);
          break;
        case "POST":
          this.handleReq(req, res, this.router.postRoutes);
          break;
        case "DELETE":
          this.handleReq(req, res, this.router.deleteRoutes);
          break;
        case "PATCH":
          this.handleReq(req, res, this.router.patchRoutes);
          break;
        case "PUT":
          this.handleReq(req, res, this.router.putRoutes);
          break;
        default:
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "method not found",
            })
          );
      }
    };
  }

  async handleReq(req, res, mapRoute) {
    const parsedUrl = url.parse(req.url, true);
    req.pathName = parsedUrl.pathname;

    req.query = parsedUrl.query;
    req.body = await this.getBody(req);

    let methods;

    const params = {};

    for (let route in mapRoute) {
      let allRoutesParts = route.split("/");
      let reqUrlParts = req.pathName.split("/");
      if (allRoutesParts.length !== reqUrlParts.length) continue;

      let index;
      for (index = 0; index < reqUrlParts.length; index++) {
        if (allRoutesParts[index].startsWith(":")) {
          params[`${allRoutesParts[index].slice(1)}`] = reqUrlParts[index];
        } else if (allRoutesParts[index] !== reqUrlParts[index]) {
          index--;
          break;
        }
      }
      if (index == allRoutesParts.length) {
        methods = mapRoute[route];
        break;
      }
    }
    if (!methods) {

      response(res,'error',404,'application/json',"Method not found");
      return;
    }
    
    

    req.params = params;
    for (const method of methods) {
      await method(req, res);
    }
  }

  async getBody(req) {
    const contentType =
      req.headers["content-type"] || req.headers["Content-Type"] || "";

    if (contentType.startsWith("text") || contentType.includes("json")) {
      return await getTextOrJsonData(req);
    } else if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("x-www-form-urlencoded")
    ) {
      return await getFormData(req);
    } else {
      if (contentType.includes("xml")) {
        return await getXMLdata(req);
      } else {
        return await getData(req);
      }
    }
  }

}

module.exports = RestRouter;
