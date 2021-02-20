resource "aws_ses_email_identity" "permitted_email1" {
  email = "21.ramit@gmail.com"
}

resource "aws_ses_email_identity" "permitted_email2" {
  email = "emailumangdoctor@gmail.com"
}

resource "aws_ses_domain_identity" "mail_domain" {
  domain = "moneo.com"
}

resource "aws_ses_template" "FeedbackTemplate" {
  name    = "FeedbackTemplate"
  subject = "Feedback"
  html    = "<html><h3>New {{type}} has been submitted by {{firstName}} {{lastName}} ({{email}}):</h3><p>{{content}}</p></html>"
  text    = "New {{type}} has been submitted by {{firstName}} {{lastName}} ({{email}}):{{content}}"
}