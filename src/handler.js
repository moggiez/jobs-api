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
        if (req.resource.includes("/tasks")) {
          await this.getTasks(req, res);
        } else {
          await this.get(req, res);
        }
      } else if (req.httpMethod == "POST") {
        if (req.resource.includes("/tasks")) {
          await this.postTask(req, res);
        } else {
          await this.post(req, res);
        }
      } else if (req.httpMethod == "PUT") {
        if (req.resource.includes("/tasks")) {
          await this.putTask(req, res);
        } else {
          await this.put(req, res);
        }
      } else if (req.httpMethod == "DELETE") {
        if (req.resource.includes("/tasks")) {
          await this.deleteTask(req, res);
        } else {
          await this.delete(req, res);
        }
      } else {
        res(500, "Not supported.");
      }
    } catch (err) {
      res(500, err);
    }
  };

  _queryJobs = async (organisationId, jobId) => {
    return await this.table.query({
      hashKey: organisationId,
      sortKey: jobId,
      indexName: "OrganisationJobs",
      filter: {
        expression: "TaskId = :taskId",
        attributes: {
          taskId: "Metadata",
        },
      },
    });
  };

  _tryGetJob = async (organisationId, jobId, response) => {
    const data = await this._queryJobs(organisationId, jobId);
    const job =
      "Item" in data ? data.Item : data.Items.length > 0 ? data.Items[0] : null;

    if (job === null) {
      response(404, "Not found.");
    }

    return job;
  };

  _queryTasks = async (organisationId, jobId) => {
    return await this.table.query({
      hashKey: organisationId,
      sortKey: jobId,
      indexName: "OrganisationJobs",
      filter: {
        expression: "TaskId <> :taskId",
        attributes: {
          taskId: "Metadata",
        },
      },
    });
  };

  get = async (request, response) => {
    try {
      const data = await this._queryJobs(
        request.pathParameters.organisationId,
        request.pathParameters.jobId
      );
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

  getTasks = async (request, response) => {
    try {
      const data = await this._queryTasks(
        request.pathParameters.organisationId,
        request.pathParameters.jobId
      );
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
      const record = { ...request.body };
      record.OrganisationId = request.pathParameters.organisationId;
      const jobId = uuid.v4();
      const data = await this.table.create({
        hashKey: jobId,
        sortKey: "Metadata",
        record: record,
      });
      data["JobId"] = jobId;
      response(201, data);
    } catch (err) {
      console.log("Error: ", err);
      response(500, "Internal server error." + err);
    }
  };

  postTask = async (request, response) => {
    try {
      const job = await this._tryGetJob(
        request.pathParameters.organisationId,
        request.pathParameters.jobId,
        response
      );

      const record = { ...request.body };
      record.OrganisationId = request.pathParameters.organisationId;
      const taskId = uuid.v4();
      const data = await this.table.create({
        hashKey: job.JobId,
        sortKey: taskId,
        record: record,
      });
      data["JobId"] = job.JobId;
      data["TaskId"] = taskId;
      response(201, data);
    } catch (err) {
      console.log("Error: ", err);
      response(500, "Internal server error." + err);
    }
  };

  put = async (request, response) => {
    try {
      const job = await this._tryGetJob(
        request.pathParameters.organisationId,
        request.pathParameters.jobId,
        response
      );

      const updateData = await this.table.update({
        hashKey: job.JobId,
        sortKey: job.TaskId,
        updatedFields: request.body,
      });
      response(200, updateData);
    } catch (err) {
      console.log("Error: ", err);
      response(500, "Internal server error." + err);
    }
  };

  putTask = async (request, response) => {
    try {
      const job = await this._tryGetJob(
        request.pathParameters.organisationId,
        request.pathParameters.jobId,
        response
      );

      const updateData = await this.table.update({
        hashKey: job.JobId,
        sortKey: request.pathParameters.taskId,
        updatedFields: request.body,
      });
      response(200, updateData);
    } catch (err) {
      console.log("Error: ", err);
      response(500, "Internal server error." + err);
    }
  };

  delete = async (request, response) => {
    try {
      const job = await this._tryGetJob(
        request.pathParameters.organisationId,
        request.pathParameters.jobId,
        response
      );

      const deleteData = await this.table.delete({
        hashKey: job.JobId,
        sortKey: job.TaskId,
      });
      response(200, deleteData);
    } catch (err) {
      console.log("Error: ", err);
      response(500, "Internal server error.");
    }
  };

  deleteTask = async (request, response) => {
    try {
      const job = await this._tryGetJob(
        request.pathParameters.organisationId,
        request.pathParameters.jobId,
        response
      );

      const deleteData = await this.table.delete({
        hashKey: job.JobId,
        sortKey: request.pathParameters.taskId,
      });
      response(200, deleteData);
    } catch (err) {
      console.log("Error: ", err);
      response(500, "Internal server error.");
    }
  };
}

exports.Handler = Handler;
