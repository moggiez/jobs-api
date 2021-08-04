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

  // PreviousTaskId, TaskType, State, Result
}