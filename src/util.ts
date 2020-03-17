export async function retry<T>(
  num: number,
  sec: number,
  callback: () => T
): Promise<T> {
  let b = callback()

  for (let i = 0; !b && i < num; i++) {
    console.log(`retry! [${i + 1}/${num}]`)
    b = await timer(sec, callback)
  }

  if (!b) {
    throw new Error('retry failure')
  }

  return b
}

export async function timer<T>(sec: number, callback: () => T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const r = callback()
      resolve(r)
    }, sec * 1000)
  })
}
