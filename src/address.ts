export function getAddrs(
  messages_: browser.messages.MessageHeader | browser.messages.MessageHeader[]
): string[] {
  const messages = Array.isArray(messages_) ? messages_ : [messages_]

  const addrs = new Map<string, string>() // no duplication address

  for (const m of messages) {
    const addrsInMessage = [
      m.author,
      ...m.recipients,
      ...m.ccList,
      ...m.bccList,
    ]

    for (const v of addrsInMessage) {
      const k = realAddr(v)
      addrs.set(k, v)
    }
  }

  return Array.from(addrs.values())
}

export function realAddr(v: string): string {
  const regex = /<?([^\s]+@[^\s>]+)>?$/
  const m = v.match(regex)

  if (m && m.length > 1) {
    return m[1]
  }

  return v
}
