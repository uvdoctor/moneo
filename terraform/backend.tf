provider "aws" {
  region = var.region
}

terraform {
  backend "s3" {
    bucket = "terraform-state-moneo"
    key    = "state/ses"
    region = "us-east-1"
    encrypt = true
    dynamodb_table = "Terraform-state-lock" 
  }
}

