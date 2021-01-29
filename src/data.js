const getIssueData = (data) => {
  if (data.data.issue !== undefined) {
    return {
      type: "ISSUE",
      level: data.data.issue.level,
      title: data.data.issue.title,
      issueUrl: `https://sentry.io/organizations/dune-analytics/issues/${data.data.issue.id}`,
      status: data.data.issue.status,
      project: data.data.issue.project.slug
    }
  } else if (data.data.error !== undefined) {
    return {
      type: "Error",
      level: data.data.error.level,
      title: data.data.error.title,
      issueUrl: `https://sentry.io/organizations/dune-analytics/issues/${data.data.error.id}`,
      status: "",
      project: "sentry"
    }
  } else if (data.data.event !== undefined) {
    const { groups: { project } } = /dune-analytics\/(?<project>.+)\/event/.exec(data.data.event.url)
    return {
      type: "EVENT",
      level: data.data.event.level,
      title: data.data.event.title,
      issueUrl: data.data.event.web_url,
      status: "",
      project: project
    }
  }
}

module.exports = { getIssueData };