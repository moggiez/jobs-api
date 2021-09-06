"use strict";

class InternalHandler {
  constructor({ table }) {
    const tableName = "jobs";

    if (!table || table.getConfig().tableName != tableName) {
      throw new Error(
        `Constructor expects '${tableName}' table passed. The passed table name does not match '${tableName}'.`
      );
    }

    this.table = table;
  }

  handle = async (event) => {
    const actionMethod = this[event.action];
    if (!actionMethod) {
      throw Error("Not supported action.");
    }
    const actionParameters = event.parameters;

    return await actionMethod(actionParameters);
  };

  updateJobState = async ({ jobId, newState }) => {};

  batchCreate = async ({ records }) => {
    await this.createAll({ records });
  };

  createJob = async ({ jobId, data }) => {
    const resultData = await this.table.create({
      hashKey: jobId,
      sortKey: "Metadata",
      record: data,
    });
    return resultData;
  };

  createAll = async ({ records }) => {
    const self = this.table;
    const params = {
      RequestItems: {},
    };
    params.RequestItems[self.config.tableName] = [];

    records.map((val) => {
      const putRequest = {
        PutRequest: {
          Item: val,
        },
      };
      params.RequestItems[self.config.tableName].push(putRequest);
    });

    return new Promise((resolve, reject) => {
      self.docClient.batchWrite(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
}

exports.InternalHandler = InternalHandler;
