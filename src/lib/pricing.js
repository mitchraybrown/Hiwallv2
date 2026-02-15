const NH = {
  "Bondi Beach":1.5,"Surry Hills":1.35,"Newtown":1.2,"Paddington":1.3,
  "Chippendale":1.1,"Darlinghurst":1.25,"Redfern":1.05,"Marrickville":1,
  "Glebe":1.1,"Manly":1.3,"Barangaroo":1.45,"Pyrmont":1.15,"Other":.9
}

export const NEIGHBORHOODS = NH
export const TRAFFIC_LEVELS = ["Low","Medium","High","Very High"]
export const CONDITIONS = ["Poor","Fair","Good","Excellent"]
export const ORIENTATIONS = ["North","South","East","West","North-East","North-West","South-East","South-West"]
export const DURATIONS = ["3","6","12","24"]
export const BUILDING_TYPES = ["Commercial","Residential","Industrial","Retail","Hospitality","Mixed Use","Temporary Wall / Hoarding","Government / Public","Other"]
export const ACCESS_OPTS = ["Ground level (no equipment)","Requires ladder/scaffolding","Requires cherry picker/boom lift","Requires building/rooftop access"]
export const HERITAGE_QS = [
  {key:"heritageListed",label:"Is this wall on a heritage-listed building?"},
  {key:"councilRestrictions",label:"Are there council restrictions on signage or murals?"},
  {key:"strataApproval",label:"Does this require body corporate or strata approval?"},
  {key:"colorRestrictions",label:"Are there colour or content restrictions?"}
]
export const COUNCILS = ["City of Sydney","Inner West","Waverley","Randwick","Bayside","Woollahra","North Sydney","Canada Bay","Burwood","Canterbury-Bankstown"]
export const SUBURB_COUNCIL = {"Surry Hills":"City of Sydney","Newtown":"Inner West","Bondi Beach":"Waverley","Paddington":"Woollahra","Chippendale":"City of Sydney","Darlinghurst":"City of Sydney","Redfern":"City of Sydney","Marrickville":"Inner West","Glebe":"City of Sydney","Manly":"North Sydney","Barangaroo":"City of Sydney","Pyrmont":"City of Sydney","Other":"City of Sydney"}
export const COORDS = {"Bondi Beach":{lat:-33.891,lng:151.274},"Surry Hills":{lat:-33.884,lng:151.211},"Newtown":{lat:-33.897,lng:151.179},"Paddington":{lat:-33.884,lng:151.226},"Chippendale":{lat:-33.888,lng:151.199},"Darlinghurst":{lat:-33.878,lng:151.218},"Redfern":{lat:-33.893,lng:151.204},"Marrickville":{lat:-33.910,lng:151.155},"Glebe":{lat:-33.879,lng:151.186},"Manly":{lat:-33.797,lng:151.287},"Barangaroo":{lat:-33.861,lng:151.202},"Pyrmont":{lat:-33.870,lng:151.194},"Other":{lat:-33.868,lng:151.209}}

export function calcPrice(w) {
  const sq = parseFloat(w.width) * parseFloat(w.height) || 20
  const base = 10
  const tM = {Low:.6,Medium:1,High:1.5,"Very High":2}[w.trafficLevel] || 1
  const nM = NH[w.neighborhood] || .9
  const cM = {Poor:.7,Fair:.85,Good:1,Excellent:1.15}[w.condition] || 1
  const oM = (w.orientation||"").includes("North") ? 1.1 : (w.orientation||"").includes("East") ? 1.05 : 1
  const dur = parseInt(w.duration) || 6
  const dD = dur >= 24 ? .85 : dur >= 12 ? .9 : dur >= 6 ? .95 : 1
  const aM = w.accessLevel === "Ground level (no equipment)" ? 1 : w.accessLevel === "Requires ladder/scaffolding" ? .95 : w.accessLevel === "Requires cherry picker/boom lift" ? .88 : .82
  const mo = sq * base * tM * nM * cM * oM * dD * aM
  const ownerTotal = Math.round(mo * dur / 100) * 100
  const ownerMonthly = Math.round(mo / 10) * 10
  const feeRate = parseFloat(w.hw_fee_percent || 25) / 100
  const hwFeeTotal = Math.round(ownerTotal * feeRate / 10) * 10
  const hwFeeMonthly = Math.round(ownerMonthly * feeRate / 10) * 10
  const campaignTotal = ownerTotal + hwFeeTotal
  const campaignMonthly = ownerMonthly + hwFeeMonthly
  return {
    ownerTotal, ownerMonthly,
    hwFeeTotal, hwFeeMonthly, hwFeePercent: parseFloat(w.hw_fee_percent || 25),
    campaignTotal, campaignMonthly,
    total: campaignTotal, monthly: campaignMonthly,
    sqm: Math.round(sq * 10) / 10,
    breakdown: {
      base: `$${base}/sqm × ${Math.round(sq*10)/10}sqm`,
      traffic: `${w.trafficLevel||"—"} (×${tM})`,
      neighborhood: `${w.neighborhood||"—"} (×${nM})`,
      condition: `${w.condition||"—"} (×${cM})`,
      orientation: `${w.orientation||"—"} (×${oM})`,
      access: `${(w.accessLevel||"—").split("(")[0].trim()} (×${aM})`,
      discount: dur >= 6 ? `${Math.round((1-dD)*100)}% multi-month` : "None",
      hwFee: `${parseFloat(w.hw_fee_percent || 25)}%`
    }
  }
}

export function campPrice(w) {
  const fee = parseFloat(w.hw_fee_percent || 25) / 100
  const price = w.price_total || w.price || 0
  return Math.round(price * (1 + fee) / 10) * 10
}

export const fmt = p => new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD",maximumFractionDigits:0}).format(p)
