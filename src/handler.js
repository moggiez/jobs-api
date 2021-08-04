"use strict";
const uuid = require("uuid");

class Handler {
  constructor(table) {
    const expectedTableName = "job_results";
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
    throw new Error("Not Implemented!");
  };

  post = async (request, response) => {
    throw new Error("Not Implemented!");
  };

  put = async (request, response) => {
    throw new Error("Not Implemented!");
  };

  delete = async (request, response) => {
    throw new Error("Not Implemented!");
  };
}

exports.Handler = Handler;