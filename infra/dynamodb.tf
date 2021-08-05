resource "aws_dynamodb_table" "jobs" {
  name           = "jobs"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "JobId"
  range_key      = "TaskId"

  attribute {
    name = "JobId"
    type = "S"
  }

  attribute {
    name = "TaskId"
    type = "S"
  }

  attribute {
    name = "State"
    type = "S"
  }

  // PreviousTaskId, TaskType, State, Result, Error
  // States: PENDING, STARTED, COMPLETED, ERROR
  // Result:
  //      - raw: value of type integer or string (raw value, ex. 'MyResult', 1, 1.2)
  //      - s3: result store in s3x (s3 path, ex. s3://my-bucket/my/path/here/file.json)

  global_secondary_index {
    name            = "JobTasksState"
    hash_key        = "JobId"
    range_key       = "State"
    write_capacity  = 5
    read_capacity   = 5
    projection_type = "ALL"
  }
}