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
    await this.table.createAll({ records });
  };

  createJob = async ({ jobId, data }) => {
    const resultData = await this.table.create({
      hashKey: jobId,
      sortKey: "Metadata",
      record: data,
    });
    return resultData;
  };
}

exports.InternalHandler = InternalHandler;
