# Changelog

## unreleased

* Add `SENTRY_INCLUDE_TAGS` environment value that can be set to a comma delimited
  list of tags from the events to include in legacy webhook event messages.
* Add `release` info to the legacy webhook event message, if available in the Sentry event.

## 0.3.2 - 2020-12-29

* Remove debug printout forgotten in previous release

## 0.3.1 - 2020-12-29

* Fix legacy webhook formatting changes from 0.3.0 and add more data,
  including browser, request url and referer, and culprit - if known.

## 0.3.0 - 2020-12-28

* Update dependencies
* Use `title` instead of `message` for legacy webhook events
* Add event `environment` to the room message from legacy webhook events

## 0.2.0 - 2020-04-09

Add support for legacy webhook events.

## 0.1.0 - 2020-04-08

First version with integration platform webhook support.
