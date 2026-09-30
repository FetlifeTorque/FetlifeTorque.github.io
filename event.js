window.EVENT = {
  name: "Surrender",
  year: 2026,
  fullName: "Dark Odyssey: Surrender",
  day: "Saturday",
  heroTagline: "The Meet Rack:",
  heroTaglineAccent: "Come Hungry!",
  siteUrl: "https://meet-rack.com",

  venue: {
    rackLocation: "Main dungeon"
  },

  discord: {
    serverName: "Surrender Discord",
    channelUrl: "https://discord.com/channels/1152407329749344278/1553528328600821841",
    channelName: "Meet Rack Channel"
  },

  fetlife: {
    // Paste the Fetlife event URL when the event page exists.
    eventUrl: "https://fetlife.com/events/2026/10/24/the-meet-rack-meet-locker-opmyir"
  },

  // column: "rack" | "locker" | "monitors" | "setup"
  // span: true stretches the item across Rack, Locker, Monitors, and Setup/Teardown.
  // Items land on the 6:00 PM–11:00 PM half-hour grid (or an extra
  // row if they fall outside that range, such as a noon lunch).
  times: {
    monitorLunchMeeting: {
      time: "12:00 (noon)",
      label: "Monitor Lunch Meeting",
      column: "monitors"
    },

    setup: {
      time: "6:00 PM",
      label: "Setup",
      column: "setup"
    },

    monitorsArrive: {
      time: "7:00 PM",
      label: "Monitors All Arrive",
      column: "monitors"
    },

    monitorShift1Start: {
      time: "7:00 PM",
      label: "Monitor Shift 1 Start",
      column: "monitors"
    },

    accessibility: {
      time: "7:15 PM",
      label: "Those with accessibility needs",
      column: "rack"
    },

    lockerDoors: {
      time: "7:15 PM",
      label: "Going on the Locker",
      column: "locker"
    },

    rackStart: {
      time: "7:30 PM",
      label: "Going on the Rack",
      column: "rack"
    },

    gropersArrive: {
      time: "8:00 PM",
      label: "Gropers Arrive",
      column: "rack"
    },

    monitorShift1End: {
      time: "9:00 PM",
      label: "Monitor Shift 1 Ends",
      column: "monitors"
    },

    monitorShift2Start: {
      time: "9:00 PM",
      label: "Monitor Shift 2 Start",
      column: "monitors"
    },

    lockerShift1End: {
      time: "9:15 PM",
      label: "Locker Shift 1 Ends",
      column: "locker"
    },

    lockerShift2: {
      time: "9:15 PM",
      label: "Locker Shift 2",
      column: "locker"
    },

    teardown: {
      time: "10:30 PM",
      label: "Start Tear down",
      column: "setup"
    }
  }
};
