// Route /{organisationId}
module "organisationId_param" {
  source             = "git@github.com:moggiez/terraform-modules.git//lambda_gateway"
  api                = aws_api_gateway_rest_api._
  lambda             = module.api_lambda.lambda
  http_methods       = local.http_methods
  resource_path_part = "{organisationId}"

  authorizer = local.authorizer

}

module "organisationId_param_cors" {
  source          = "git@github.com:moggiez/terraform-modules.git//api_gateway_enable_cors"
  api_id          = aws_api_gateway_rest_api._.id
  api_resource_id = module.organisationId_param.api_resource.id
}

// Route /{organisationId}/jobs
module "jobs_part" {
  source             = "git@github.com:moggiez/terraform-modules.git//lambda_gateway"
  api                = aws_api_gateway_rest_api._
  parent_resource    = module.organisationId_param.api_resource
  lambda             = module.api_lambda.lambda
  http_methods       = local.http_methods
  resource_path_part = "jobs"

  authorizer = local.authorizer

}

module "jobs_part_cors" {
  source          = "git@github.com:moggiez/terraform-modules.git//api_gateway_enable_cors"
  api_id          = aws_api_gateway_rest_api._.id
  api_resource_id = module.jobs_part.api_resource.id
}

// Route /{organisationId}/jobs/{jobId}
module "jobId_param" {
  source             = "git@github.com:moggiez/terraform-modules.git//lambda_gateway"
  api                = aws_api_gateway_rest_api._
  parent_resource    = module.jobs_part.api_resource
  lambda             = module.api_lambda.lambda
  http_methods       = local.http_methods
  resource_path_part = "{jobId}"

  authorizer = local.authorizer
}

module "jobId_param_cors" {
  source          = "git@github.com:moggiez/terraform-modules.git//api_gateway_enable_cors"
  api_id          = aws_api_gateway_rest_api._.id
  api_resource_id = module.jobId_param.api_resource.id
}

// Route /{organisationId}/jobs/{jobId}/tasks
module "tasks_part" {
  source             = "git@github.com:moggiez/terraform-modules.git//lambda_gateway"
  api                = aws_api_gateway_rest_api._
  parent_resource    = module.jobId_param.api_resource
  lambda             = module.api_lambda.lambda
  http_methods       = local.http_methods
  resource_path_part = "tasks"

  authorizer = local.authorizer

}

module "tasks_part_cors" {
  source          = "git@github.com:moggiez/terraform-modules.git//api_gateway_enable_cors"
  api_id          = aws_api_gateway_rest_api._.id
  api_resource_id = module.tasks_part.api_resource.id
}

// Route /{organisationId}/jobs/{jobId}/tasks/{taskId}
module "taskId_param" {
  source             = "git@github.com:moggiez/terraform-modules.git//lambda_gateway"
  api                = aws_api_gateway_rest_api._
  parent_resource    = module.tasks_part.api_resource
  lambda             = module.api_lambda.lambda
  http_methods       = local.http_methods
  resource_path_part = "{taskId}"

  authorizer = local.authorizer
}

module "taskId_param_cors" {
  source          = "git@github.com:moggiez/terraform-modules.git//api_gateway_enable_cors"
  api_id          = aws_api_gateway_rest_api._.id
  api_resource_id = module.taskId_param.api_resource.id
}
