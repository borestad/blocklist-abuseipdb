#!/usr/bin/env -S deno run -A --node-modules-dir=auto

import maxmind from 'npm:maxmind'

const { log } = console
const filePath = Deno.env.get('HOME') + '/.local/share/ipinfo/country_asn.mmdb'
const lookup = await maxmind.open(filePath)

function ip2Comment(ip: string) {
  const info: any = lookup.get(ip)
  // log(info)
  const country: string = ((info?.country || '-') + '').padEnd(3)
  const asn: string = ((info?.asn || '-') + '').padEnd(9)
  const asName: string = info?.as_name || '-'
  const asDomain: string = info?.as_domain || '-'

  ip = ip.padEnd(16)

  log(`${ip} # ${country} ${asn} ${asName}`)
}

const input = await new Response(Deno.stdin.readable).text()

const ips = input
  .trim()
  .replaceAll(/^\s*[\r\n]/gm, '')
  .split('\n')

const comments = ips.filter(line => line.startsWith('#'))
const ipLines = ips.filter(line => !line.startsWith('#'))
  .map(line => line.replaceAll(/#.*$/gm, "").trim())

for (const comment of comments) {
  log(comment)
}

for (const ip of ipLines) {
  ip2Comment(ip)
}

