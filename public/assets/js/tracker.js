class Tracker {
  constructor() {
    this.events = []
    this.lastSentAt = Date.now()
    this.initListeners()
  }

  initListeners() {
    // patch all links on page to prevent default behaviour
    window.addEventListener('load', () => {
      const links = document.querySelectorAll('a')
      links.forEach((link) => {
        const originalClick = link.onclick
        link.onclick = function (e) {
          e.preventDefault()
          originalClick(e)
          // go to original href after 10ms
          setTimeout(() => {
            window.location.href = link.href
          }, 10)
        }
      })
    })

    // add beforeunload event to handle page leave
    window.addEventListener('beforeunload', () => {
      // make a request and assumes that race condition is on our side :)
      this.send()
    })
  }

  track(event, ...tags) {
    this.events.push({ event, tags, ...this.collectMetaInfo() })
    // if link clicked send events without checks
    if (
      event === 'click-link' ||
      (Date.now() - this.lastSentAt > 1000 && this.events.length >= 3)
    ) {
      this.send()
    }
  }

  send() {
    this.lastSentAt = Date.now()
    // copy events buffer
    const eventsToSend = [...this.events]
    // flush original buffer
    this.events = []

    if (eventsToSend.length > 0) {
      fetch('http://localhost:8001/track', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: JSON.stringify(eventsToSend),
      }).then((res) => {
        if (!res.ok) {
          console.error('failed to load events', res.status, res.statusText)
          this.events.push(...eventsToSend)
        }
      })
    }
  }

  collectMetaInfo() {
    return {
      url: window.location.href,
      title: document.title,
      ts: new Date().toISOString(),
    }
  }
}

window.tracker = new Tracker()
