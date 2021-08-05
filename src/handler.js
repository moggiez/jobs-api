"use strict";
const uuid = require("uuid");

class Handler {
  constructor(table) {
    const expectedTableName = "jobs";
    if (table && table.getConfig().tableName != expectedTableName) {
      throw new Error(
        `Constructor expects '${expectedTableName}' table passed. The passed table name does not match '${expectedTableName}'.`
      );
    }
    this.table = table;
  }

  handle = async (req, res) => {
    try {
      if (req.httpMethod == "GET") {
        this.get(req, res);
      } else if (req.httpMethod == "POST") {
        this.post(req, res);
      } else if (req.httpMethod == "PUT") {
        this.put(req, res);
      } else if (req.httpMethod == "DELETE") {
        this.delete(req, res);
      } else {
        res(500, "Not supported.");
      }
    } catch (err) {
      res(500, err);
    }
  };

  get = async (request, response) => {
    try {
      const data = await this.table.query({
        hashKey: request.pathParameters.organisationId,
        sortKey: request.pathParameters.jobId,
      });
      const responseBody =
        "Items" in data
          ? {
              data: data.Items,
            }
          : data.Item;
      response(200, responseBody);
    } catch (err) {
      console.log("Error: ", err);
      response(500, "Internal server error.");
    }
  };

  post = async (request, response) => {
    try {
      const jobId = uuid.v4();
      const data = await this.table.create({
        hashKey: request.pathParameters.organisationId,
        sortKey: jobId,
        record: request.body,
      });
      data["JobId"] = jobId;
      response(200, data);
    } catch (err) {
      console.log("Error: ", err);
      response(500, "Internal server error.");
    }
  };

  put = async (request, response) => {
    throw new Error("Not Implemented!");
  };

  delete = async (request, response) => {
    throw new Error("Not Implemented!");
  };
}

exports.Handler = Handler;
