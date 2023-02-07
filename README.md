# Serverless Lambda Function for Google OAuth

This repository contains a serverless Lambda function for authenticating users with Google. The function implements the following flow:

## Endpoint: outh-google

This endpoint provides a redirection URL with defined scopes. The URL brings the user to the Google sign-in page.

## Endpoint: redirect-from-google

After the user enters their credentials on the Google sign-in page, Google sends a query code to this endpoint. Using the query code, access tokens are fetched with axios post requests and stored in MongoDB.

## Technical details

The repository uses AWS Lambda to implement the serverless function and MongoDB to store access tokens.


