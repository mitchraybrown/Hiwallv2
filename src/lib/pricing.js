const NH = {
  // City of Sydney
  "Surry Hills":1.35,"Chippendale":1.1,"Darlinghurst":1.25,"Redfern":1.05,
  "Glebe":1.1,"Barangaroo":1.45,"Pyrmont":1.15,"Alexandria":1.1,
  "Ultimo":1.1,"Haymarket":1.3,"Waterloo":1.0,"Zetland":1.0,
  "Rosebery":1.0,"Erskineville":1.1,"Woolloomooloo":1.15,
  "Potts Point":1.25,"Elizabeth Bay":1.2,"Rushcutters Bay":1.15,
  "Millers Point":1.3,"Dawes Point":1.3,"The Rocks":1.4,
  "Camperdown":1.05,"Forest Lodge":1.05,"Centennial Park":1.15,
  "Moore Park":1.1,"Sydney CBD":1.5,
  // Inner West
  "Newtown":1.2,"Marrickville":1.0,"Enmore":1.15,"Stanmore":1.05,
  "Petersham":1.0,"Leichhardt":1.05,"Annandale":1.05,"Balmain":1.15,
  "Rozelle":1.1,"Lilyfield":1.05,"Dulwich Hill":0.95,"Lewisham":0.95,
  "Summer Hill":0.95,"Ashfield":0.95,"Haberfield":1.0,"Tempe":0.95,
  "St Peters":1.05,"Sydenham":0.95,
  // Waverley
  "Bondi Beach":1.5,"Bondi Junction":1.25,"Bondi":1.3,"Bronte":1.25,
  "Tamarama":1.25,"Waverley":1.15,"Queens Park":1.15,"Dover Heights":1.1,
  "Vaucluse":1.2,
  // Woollahra
  "Paddington":1.3,"Double Bay":1.35,"Woollahra":1.25,"Rose Bay":1.2,
  "Bellevue Hill":1.2,"Edgecliff":1.15,"Point Piper":1.3,
  // Randwick
  "Randwick":1.1,"Coogee":1.2,"Maroubra":1.0,"Kensington":1.05,
  "Kingsford":1.0,"La Perouse":0.9,"Little Bay":0.9,"Malabar":0.9,
  // North Sydney
  "North Sydney":1.25,"Manly":1.3,"Mosman":1.2,"Neutral Bay":1.15,
  "Cremorne":1.15,"Kirribilli":1.2,"Milsons Point":1.2,
  "Crows Nest":1.1,"Cammeray":1.05,"Wollstonecraft":1.05,
  "Waverton":1.05,"McMahons Point":1.15,
  // Bayside
  "Mascot":1.0,"Botany":0.95,"Eastgardens":0.95,"Pagewood":0.9,
  "Rockdale":0.9,"Arncliffe":0.85,"Kogarah":0.9,"Brighton-Le-Sands":0.95,
  // Canada Bay
  "Five Dock":1.0,"Drummoyne":1.1,"Concord":0.95,"Rhodes":1.0,
  "Breakfast Point":1.0,"Canada Bay":0.95,"Abbotsford":1.0,
  // Burwood
  "Burwood":0.95,"Strathfield":0.95,"Croydon":0.9,"Enfield":0.9,
  // Canterbury-Bankstown
  "Canterbury":0.85,"Bankstown":0.85,"Lakemba":0.8,"Campsie":0.85,
  "Belmore":0.8,"Punchbowl":0.8,"Hurstville":0.9,
  // Other
  "Other":0.9
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
export const SUBURB_COUNCIL = {
  "Surry Hills":"City of Sydney","Chippendale":"City of Sydney","Darlinghurst":"City of Sydney",
  "Redfern":"City of Sydney","Glebe":"City of Sydney","Barangaroo":"City of Sydney",
  "Pyrmont":"City of Sydney","Alexandria":"City of Sydney","Ultimo":"City of Sydney",
  "Haymarket":"City of Sydney","Waterloo":"City of Sydney","Zetland":"City of Sydney",
  "Rosebery":"City of Sydney","Erskineville":"City of Sydney","Woolloomooloo":"City of Sydney",
  "Potts Point":"City of Sydney","Elizabeth Bay":"City of Sydney","Rushcutters Bay":"City of Sydney",
  "Millers Point":"City of Sydney","Dawes Point":"City of Sydney","The Rocks":"City of Sydney",
  "Camperdown":"City of Sydney","Forest Lodge":"City of Sydney","Centennial Park":"City of Sydney",
  "Moore Park":"City of Sydney","Sydney CBD":"City of Sydney",
  "Newtown":"Inner West","Marrickville":"Inner West","Enmore":"Inner West","Stanmore":"Inner West",
  "Petersham":"Inner West","Leichhardt":"Inner West","Annandale":"Inner West","Balmain":"Inner West",
  "Rozelle":"Inner West","Lilyfield":"Inner West","Dulwich Hill":"Inner West","Lewisham":"Inner West",
  "Summer Hill":"Inner West","Ashfield":"Inner West","Haberfield":"Inner West","Tempe":"Inner West",
  "St Peters":"Inner West","Sydenham":"Inner West",
  "Bondi Beach":"Waverley","Bondi Junction":"Waverley","Bondi":"Waverley","Bronte":"Waverley",
  "Tamarama":"Waverley","Waverley":"Waverley","Queens Park":"Waverley","Dover Heights":"Waverley",
  "Vaucluse":"Waverley",
  "Paddington":"Woollahra","Double Bay":"Woollahra","Woollahra":"Woollahra","Rose Bay":"Woollahra",
  "Bellevue Hill":"Woollahra","Edgecliff":"Woollahra","Point Piper":"Woollahra",
  "Randwick":"Randwick","Coogee":"Randwick","Maroubra":"Randwick","Kensington":"Randwick",
  "Kingsford":"Randwick","La Perouse":"Randwick","Little Bay":"Randwick","Malabar":"Randwick",
  "North Sydney":"North Sydney","Manly":"North Sydney","Mosman":"North Sydney","Neutral Bay":"North Sydney",
  "Cremorne":"North Sydney","Kirribilli":"North Sydney","Milsons Point":"North Sydney",
  "Crows Nest":"North Sydney","Cammeray":"North Sydney","Wollstonecraft":"North Sydney",
  "Waverton":"North Sydney","McMahons Point":"North Sydney",
  "Mascot":"Bayside","Botany":"Bayside","Eastgardens":"Bayside","Pagewood":"Bayside",
  "Rockdale":"Bayside","Arncliffe":"Bayside","Kogarah":"Bayside","Brighton-Le-Sands":"Bayside",
  "Five Dock":"Canada Bay","Drummoyne":"Canada Bay","Concord":"Canada Bay","Rhodes":"Canada Bay",
  "Breakfast Point":"Canada Bay","Canada Bay":"Canada Bay","Abbotsford":"Canada Bay",
  "Burwood":"Burwood","Strathfield":"Burwood","Croydon":"Burwood","Enfield":"Burwood",
  "Canterbury":"Canterbury-Bankstown","Bankstown":"Canterbury-Bankstown","Lakemba":"Canterbury-Bankstown",
  "Campsie":"Canterbury-Bankstown","Belmore":"Canterbury-Bankstown","Punchbowl":"Canterbury-Bankstown",
  "Hurstville":"Canterbury-Bankstown",
  "Other":"City of Sydney"
}
export const COORDS = {
  "Surry Hills":{lat:-33.884,lng:151.211},"Chippendale":{lat:-33.888,lng:151.199},
  "Darlinghurst":{lat:-33.878,lng:151.218},"Redfern":{lat:-33.893,lng:151.204},
  "Glebe":{lat:-33.879,lng:151.186},"Barangaroo":{lat:-33.861,lng:151.202},
  "Pyrmont":{lat:-33.870,lng:151.194},"Alexandria":{lat:-33.903,lng:151.195},
  "Ultimo":{lat:-33.878,lng:151.197},"Haymarket":{lat:-33.880,lng:151.204},
  "Waterloo":{lat:-33.900,lng:151.209},"Zetland":{lat:-33.906,lng:151.212},
  "Rosebery":{lat:-33.912,lng:151.206},"Erskineville":{lat:-33.901,lng:151.186},
  "Woolloomooloo":{lat:-33.871,lng:151.222},"Potts Point":{lat:-33.870,lng:151.226},
  "Elizabeth Bay":{lat:-33.871,lng:151.228},"Rushcutters Bay":{lat:-33.875,lng:151.230},
  "Millers Point":{lat:-33.858,lng:151.204},"Dawes Point":{lat:-33.855,lng:151.208},
  "The Rocks":{lat:-33.859,lng:151.208},"Camperdown":{lat:-33.889,lng:151.178},
  "Forest Lodge":{lat:-33.882,lng:151.182},"Centennial Park":{lat:-33.895,lng:151.233},
  "Moore Park":{lat:-33.893,lng:151.222},"Sydney CBD":{lat:-33.868,lng:151.209},
  "Newtown":{lat:-33.897,lng:151.179},"Marrickville":{lat:-33.910,lng:151.155},
  "Enmore":{lat:-33.899,lng:151.174},"Stanmore":{lat:-33.895,lng:151.165},
  "Petersham":{lat:-33.895,lng:151.155},"Leichhardt":{lat:-33.884,lng:151.156},
  "Annandale":{lat:-33.882,lng:151.170},"Balmain":{lat:-33.858,lng:151.180},
  "Rozelle":{lat:-33.862,lng:151.171},"Lilyfield":{lat:-33.869,lng:151.168},
  "Dulwich Hill":{lat:-33.905,lng:151.140},"Lewisham":{lat:-33.897,lng:151.148},
  "Summer Hill":{lat:-33.892,lng:151.139},"Ashfield":{lat:-33.889,lng:151.126},
  "Haberfield":{lat:-33.881,lng:151.138},"Tempe":{lat:-33.921,lng:151.162},
  "St Peters":{lat:-33.910,lng:151.175},"Sydenham":{lat:-33.917,lng:151.167},
  "Bondi Beach":{lat:-33.891,lng:151.274},"Bondi Junction":{lat:-33.892,lng:151.250},
  "Bondi":{lat:-33.893,lng:151.263},"Bronte":{lat:-33.903,lng:151.268},
  "Tamarama":{lat:-33.900,lng:151.271},"Waverley":{lat:-33.898,lng:151.253},
  "Queens Park":{lat:-33.899,lng:151.245},"Dover Heights":{lat:-33.879,lng:151.280},
  "Vaucluse":{lat:-33.860,lng:151.280},
  "Paddington":{lat:-33.884,lng:151.226},"Double Bay":{lat:-33.877,lng:151.243},
  "Woollahra":{lat:-33.887,lng:151.240},"Rose Bay":{lat:-33.870,lng:151.260},
  "Bellevue Hill":{lat:-33.880,lng:151.256},"Edgecliff":{lat:-33.880,lng:151.237},
  "Point Piper":{lat:-33.867,lng:151.253},
  "Randwick":{lat:-33.913,lng:151.241},"Coogee":{lat:-33.920,lng:151.256},
  "Maroubra":{lat:-33.940,lng:151.243},"Kensington":{lat:-33.907,lng:151.222},
  "Kingsford":{lat:-33.920,lng:151.228},"La Perouse":{lat:-33.986,lng:151.233},
  "Little Bay":{lat:-33.978,lng:151.245},"Malabar":{lat:-33.962,lng:151.249},
  "North Sydney":{lat:-33.838,lng:151.207},"Manly":{lat:-33.797,lng:151.287},
  "Mosman":{lat:-33.829,lng:151.244},"Neutral Bay":{lat:-33.834,lng:151.218},
  "Cremorne":{lat:-33.830,lng:151.226},"Kirribilli":{lat:-33.848,lng:151.213},
  "Milsons Point":{lat:-33.847,lng:151.211},"Crows Nest":{lat:-33.826,lng:151.203},
  "Cammeray":{lat:-33.822,lng:151.210},"Wollstonecraft":{lat:-33.831,lng:151.196},
  "Waverton":{lat:-33.839,lng:151.200},"McMahons Point":{lat:-33.844,lng:151.205},
  "Mascot":{lat:-33.927,lng:151.194},"Botany":{lat:-33.945,lng:151.198},
  "Eastgardens":{lat:-33.942,lng:151.227},"Pagewood":{lat:-33.935,lng:151.225},
  "Rockdale":{lat:-33.952,lng:151.137},"Arncliffe":{lat:-33.937,lng:151.147},
  "Kogarah":{lat:-33.963,lng:151.133},"Brighton-Le-Sands":{lat:-33.960,lng:151.155},
  "Five Dock":{lat:-33.868,lng:151.129},"Drummoyne":{lat:-33.855,lng:151.154},
  "Concord":{lat:-33.862,lng:151.104},"Rhodes":{lat:-33.831,lng:151.088},
  "Breakfast Point":{lat:-33.847,lng:151.116},"Canada Bay":{lat:-33.862,lng:151.119},
  "Abbotsford":{lat:-33.850,lng:151.129},
  "Burwood":{lat:-33.877,lng:151.104},"Strathfield":{lat:-33.879,lng:151.093},
  "Croydon":{lat:-33.883,lng:151.115},"Enfield":{lat:-33.895,lng:151.104},
  "Canterbury":{lat:-33.912,lng:151.118},"Bankstown":{lat:-33.917,lng:151.035},
  "Lakemba":{lat:-33.920,lng:151.076},"Campsie":{lat:-33.912,lng:151.103},
  "Belmore":{lat:-33.921,lng:151.090},"Punchbowl":{lat:-33.929,lng:151.055},
  "Hurstville":{lat:-33.966,lng:151.101},
  "Other":{lat:-33.868,lng:151.209}
}

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
