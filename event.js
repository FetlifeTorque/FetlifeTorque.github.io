window.EVENT = {
  name: "Surrender",
  year: 2026,
  fullName: "Dark Odyssey: Surrender",
  day: "Saturday",
  heroTagline: "The Meet Rack: Come Hungry",
  siteUrl: "https://meet-rack.com",

  venue: {
    rackLocation: "Main dungeon"
  },

  discord: {
    serverName: "Surrender Discord",
    channelUrl: "https://discord.com/channels/1367654730956017674/1508513681837789375",
    channelName: "Meet Rack Channel"
  },

  fetlife: {
    // Paste the Fetlife event URL when the event page exists.
    eventUrl: ""
  },

  // Listed in timeline order. onSchedule: false keeps a time for page text
  // without putting it on the home-page schedule. monitor: true hides a
  // schedule row until "Show Monitoring Schedule" is clicked.
  times: {
    
    monitorLunchMeeting: {
      time: "12:00 (noon)",
      label: "Monitor Lunch Meeting",
      monitor: true,
      onSchedule: true
    },

    setup: {
      time: "6:00 PM",
      label: "Setup",
      kind: "setup",
      monitor: false,
      onSchedule: true
    },

    monitorsArrive: {
      time: "7:00 PM",
      label: "Monitors All Arrive",
      monitor: true,
      onSchedule: true
    },

    monitorShift1Start: {
      time: "7:00 PM",
      label: "Monitor Shift 1 Start",
      monitor: true,
      onSchedule: true
    },

    accessibility: {
      time: "7:15 PM",
      label: "Those with accessibility needs",
      monitor: false,
      onSchedule: true
    },

    lockerDoors: {
      time: "7:15 PM",
      label: "Going on the Locker",
      monitor: false,
      onSchedule: true
    },

    rackStart: {
      time: "7:30 PM",
      label: "Going on the Rack",
      monitor: false,
      onSchedule: true
    },

    gropersArrive: {
      time: "8:00 PM",
      label: "Gropers Arrive",
      monitor: false,
      onSchedule: true
    },

    monitorShift2Start: {
      time: "8:30 PM",
      label: "Monitor Shift 2 Start",
      monitor: true,
      onSchedule: true
    },

    monitorShift1End: {
      time: "9:00 PM",
      label: "Monitor Shift 1 Ends",
      monitor: true,
      onSchedule: true
    },

    lockerShift1End: {
      time: "9:15 PM",
      label: "Locker Shift 1 Ends",
      monitor: false,
      onSchedule: false
    },

    lockerShift2: {
      time: "9:15 PM",
      label: "Locker Shift 2",
      monitor: false,
      onSchedule: true
    },

    teardown: {
      time: "10:30 PM",
      label: "All Done, start Teardown",
      kind: "cleanup",
      monitor: false,
      onSchedule: true
    },

    setupCrew: {
      time: "7:00–8:00 PM",
      label: "Setup crew window",
      monitor: false,
      onSchedule: false
    }
  }
};
