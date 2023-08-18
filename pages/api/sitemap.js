/* @flow */
import fs from "fs-extra"
import Path from "path"
import ChildProcess from "child_process"

import cmsAllPagesQuery from "@/queries/content/allPages"
import {queryGraphQlWithErrorLogging} from "@/src/utils/apolloClient";
import categories from "@/src/constants/categories"

// $FlowIgnore This would be fiddly to type correctly using flow.js
// so instead let's not bother and fix it up when we move to typescript
export default async function handler(req: any, res: any) {
    const categorySlugs = categories
        .map(category => category.key)
        .filter(slug => slug !== "search")

    const contentPages = await queryGraphQlWithErrorLogging({
        query: cmsAllPagesQuery,
        fetchPolicy: "no-cache",
    }).then(res => res.data.pages)

    function getLastModifiedDate(filePath: string): string {
        const lastModifiedDate = ChildProcess.spawnSync(
            "git",
            [
                "--no-pager",
                "log",
                "-1",
                "--date=iso-strict-local",
                "--format='%ad'",
                "--",
                "pages/404.js",
            ],
            {
                env: {
                    TZ: "UTC",
                },
            }
        ).stdout.toString().match(/^'(.*)'/)?.[1]

        if (!lastModifiedDate) {
            throw new Error(`Could not get last modified date for ${filePath}`)
        }

        return lastModifiedDate
    }

    const staticPages = await fs.readdir("./pages").then(
        filenames => filenames
            .map(filename => ({
                slug: filename.match(/([A-Za-z0-9_-]+).js/)?.[1],
                modifiedOn: getLastModifiedDate(Path.join("./pages", filename)),
            }))
            .filter(
                page =>
                    page.slug &&
                    !page.slug.startsWith("_") &&
                    !page.slug.match(/^\d*$/) &&
                    page.slug !== "index"
            )
    )

    function getFullUrl(path: string): string {
        return (new URL(path, process.env.SITE_BASE_URL)).href
    }

    const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${getFullUrl("/")}</loc>
    </url>
    ${contentPages.map(page => `
    <url>
        <loc>${getFullUrl(page.Path)}</loc>
        <lastmod>${page.updated_at}</lastmod>
    </url>
    `).join("")}
    ${staticPages.map(page => `
    <url>
        <loc>${getFullUrl(page.slug)}</loc>
        <lastmod>${page.modifiedOn}</lastmod>
    </url>
    `).join("")}
    ${categorySlugs.map(
        slug => popularLocations.map(
            location => `
    <url>
        <loc>${getFullUrl(Path.join("/", slug, location))}</loc>
    </url>
            `
        )
    ).flat().join("")}
</urlset>`.trim()

    res.statusCode = 200
    res.setHeader("Content-Type", "text/xml")
    res.setHeader("Cache-control", "stale-while-revalidate, s-maxage=3600")
    res.end(xml)
}

const popularLocations = [
    "Melbourne-VIC",
    "Sydney-NSW",
    "Perth-WA",
    "Adelaide-SA",
    "Newcastle-NSW",
    "Carlton North-VIC",
    "Dawes Point-NSW",
    "Spring Hill-QLD",
    "Bardon-QLD",
    "St Kilda-VIC",
    "Richmond-VIC",
    "Darlinghurst-NSW",
    "Hobart-TAS",
    "Footscray-VIC",
    "Surry Hills-NSW",
    "Dandenong-VIC",
    "Redfern-NSW",
    "City-ACT",
    "Fitzroy-VIC",
    "Liverpool-NSW",
    "Launceston-TAS",
    "Preston-VIC",
    "Geelong-VIC",
    "Reservoir-VIC",
    "Bendigo-VIC",
    "Deer Park-VIC",
    "Main Beach-QLD",
    "Prestons-NSW",
    "Minchinbury-NSW",
    "Dandenong North-VIC",
    "Box Hill-VIC",
    "Parramatta-NSW",
    "Potts Point-NSW",
    "Ashfield-NSW",
    "Leumeah-NSW",
    "Collingwood-VIC",
    "Frankston-VIC",
    "Kanimbla-QLD",
    "Brunswick-VIC",
    "Blacktown-NSW",
    "Carnegie-VIC",
    "Coburg-VIC",
    "Melton-VIC",
    "Ipswich-QLD",
    "Warrenheip-VIC",
    "Croydon-VIC",
    "Frankston South-VIC",
    "Campbelltown-NSW",
    "North Melbourne-VIC",
    "Cremorne-VIC",
    "Penrith-NSW",
    "Seddon-VIC",
    "Carlton-VIC",
    "Kingston-QLD",
    "Rockingham-WA",
    "Wollongong-NSW",
    "Raceview-QLD",
    "Inala-QLD",
    "Shelly Beach-QLD",
    "Bar Beach-NSW",
    "Point Cook-VIC",
    "Sunshine West-VIC",
    "Rockville-QLD",
    "Hoppers Crossing-VIC",
    "Lilydale-VIC",
    "Mountain Top-NSW",
    "Glenroy-VIC",
    "Harris Park-NSW",
    "South Melbourne-VIC",
    "Brisbane City-QLD",
    "Maroochydore-QLD",
    "Werribee-VIC",
    "Mount Saint Thomas-NSW",
    "Fremantle-WA",
    "Beenleigh-QLD",
    "Logan Village-QLD",
    "Prospect-NSW",
    "Fairfield-NSW",
    "Labrador-QLD",
    "South Geelong-VIC",
    "Wagaman-NT",
    "Fortitude Valley-QLD",
    "Mangrove Creek-NSW",
    "Mount Druitt-NSW",
    "Broadmeadows-VIC",
    "Stratford-QLD",
    "Mildura-VIC",
    "Maroubra-NSW",
    "Highgate Hill-QLD",
    "Leonay-NSW",
    "Rowville-VIC",
    "Ringwood-VIC",
    "Newstead-QLD",
    "Albury-NSW",
    "Kealba-VIC",
    "Marrickville-NSW",
    "East Perth-WA",
    "Hurstville-NSW",
    "Glen Huntly-VIC",
    "Epping-VIC",
    "Dallas-VIC",
    "Withers-WA",
    "Prahran-VIC",
    "Caboolture-QLD",
    "Fitzroy North-VIC",
    "Bohle-QLD",
    "Northcote-VIC",
    "Narre Warren-VIC",
    "Wantirna-VIC",
    "Roxburgh Park-VIC",
    "Sunshine-VIC",
    "Koongal-QLD",
    "Port Adelaide-SA",
    "Lismore-NSW",
    "Gosford-NSW",
    "Mount Clear-VIC",
    "Southport-QLD",
    "Darwin City-NT",
    "South Yarra-VIC",
    "Belconnen-ACT",
    "Bunbury-WA",
    "Ringwood North-VIC",
    "Springfield-QLD",
    "Wodonga-VIC",
    "Mannering Park-NSW",
    "Mackay-QLD",
    "Chermside-QLD",
    "Rocksberg-QLD",
    "Bankstown-NSW",
    "Midvale-WA",
    "Bondi-NSW",
    "Drinan-QLD",
    "Ormond-VIC",
    "Laverton-VIC",
    "Orange-NSW",
    "Capalaba-QLD",
    "Glenvale-QLD",
    "Qunaba-QLD",
    "Tweed Heads-NSW",
    "Nunawading-VIC",
    "Southbank-VIC",
    "Oakleigh-VIC",
    "Korora-NSW",
    "Boronia-VIC",
    "Glebe-NSW",
    "Redcliffe-QLD",
    "Chippendale-NSW",
    "Greenslopes-QLD",
    "Nowra-NSW",
    "Braybrook-VIC",
    "Auburn-NSW",
    "Long Gully-VIC",
    "Emerald-QLD",
    "Noble Park-VIC",
    "Skye-VIC",
    "Waterloo-NSW",
    "Bardwell Park-NSW",
    "Wagga Wagga-NSW",
    "Wheelers Hill-VIC",
    "Hawthorn-VIC",
    "Fernbank Creek-NSW",
    "Berwick-VIC",
    "Thornbury-VIC",
    "Bankstown Aerodrome-NSW",
    "Cranbourne-VIC",
    "Blackburn-VIC",
    "Enmore-NSW",
    "Salisbury-SA",
    "Caniambo-VIC",
    "Magenta-NSW",
    "Ultimo-NSW",
    "Newtown-NSW",
    "Byron Bay-NSW",
    "Coffs Harbour-NSW",
    "St Kilda East-VIC",
    "Wildwood-VIC",
    "Williamstown-VIC",
    "Clayton-VIC",
    "Boynedale-QLD",
    "Aspley-QLD",
    "Boondall-QLD",
    "San Remo-WA",
    "Brookdale-WA",
    "Burwood-NSW",
    "Kew-VIC",
    "Stanmore-NSW",
    "Cheltenham-VIC",
    "Scarborough-QLD",
    "Eastwood-NSW",
    "Lennox Head-NSW",
    "East Melbourne-VIC",
    "Ballina-NSW",
    "Cashmere-QLD",
    "Thomastown-VIC",
    "Griffin-QLD",
    "Oxley Park-NSW",
    "Maidstone-VIC",
    "Deception Bay-QLD",
    "Manly-NSW",
    "Caulfield-VIC",
    "Cessnock-NSW",
    "Racecourse-QLD",
    "Maxwell-NSW",
    "Charlestown-NSW",
    "Woodridge-QLD",
    "Craigieburn-VIC",
    "Brunswick West-VIC",
    "Eaglemont-VIC",
    "Kippa-Ring-QLD",
    "Doreen-VIC",
    "Wyong-NSW",
    "Bowling Alley Point-NSW",
    "Leichhardt-NSW",
    "Bundoora-VIC",
    "Shepparton-VIC",
    "Osterley-NSW",
    "Wangaratta-VIC",
    "Mays Hill-NSW",
    "Sale-VIC",
    "Yarraville-VIC",
    "Parkes-ACT",
    "West Melbourne-VIC",
    "Logan Central-QLD",
    "South Brisbane-QLD",
    "Bayswater-VIC",
    "Kwinana Town Centre-WA",
    "Hilton-WA",
    "Jordan Springs-NSW",
    "Albert Park-VIC",
    "Lower Beechmont-QLD",
    "Sunbury-VIC",
    "Brunswick East-VIC",
    "Elwood-VIC",
    "Island Plantation-QLD",
    "Ournie-NSW",
    "Taree-NSW",
    "Chadstone-VIC",
    "McDowall-QLD",
    "Dubbo-NSW",
    "Shorncliffe-QLD",
    "Dulwich Hill-NSW",
    "Port Macquarie-NSW",
    "Lysterfield-VIC",
    "St Albans-VIC",
    "South Morang-VIC",
    "Brighton-VIC",
    "Surfers Paradise-QLD",
    "Mount Waverley-VIC",
    "Glen Iris-VIC",
    "Pimpama-QLD",
    "Bellfield-VIC",
    "Joondalup-WA",
    "Rooty Hill-NSW",
    "Parkville-VIC",
    "Travancore-VIC",
    "Mount Gambier-SA",
    "Marsden-QLD",
    "Mount Cottrell-VIC",
    "Flemington-VIC",
    "Mount Russell-NSW",
    "Midland-WA",
    "Fairfield-VIC",
    "Sydney Olympic Park-NSW",
    "Sydenham-VIC",
    "Broome-WA",
    "Burnie-TAS",
    "New Farm-QLD",
    "Fishing Point-NSW",
    "Pakenham-VIC",
    "Burwood-VIC",
    "Broadbeach-QLD",
    "Dennington-VIC",
    "Mitcham-VIC",
    "Heritage Park-QLD",
    "Robina-QLD",
    "Buttai-NSW",
    "Grafton-NSW",
    "Strathpine-QLD",
    "Burleigh Heads-QLD",
    "Morwell-VIC",
    "West End-QLD",
    "Pyrmont-NSW",
    "Wynnum-QLD",
    "Aberfeldie-VIC",
    "Mill Park-VIC",
    "North Shore-VIC",
    "Callignee-VIC",
    "Kenwick-WA",
    "Ayr-QLD",
    "Warrnambool-VIC",
    "Ferntree Gully-VIC",
    "Cleveland-QLD",
    "Camperdown-NSW",
    "Rothwell-QLD",
    "Randwick-NSW",
    "Chatswood-NSW",
    "Dudley-NSW",
    "Docklands-VIC",
    "Lawson-ACT",
    "Wishart-QLD",
    "Heidelberg-VIC",
    "Busby-NSW",
    "Kingsgrove-NSW",
    "Nambour-QLD",
    "Belmont-NSW",
    "Margate-QLD",
    "Cairns City-QLD",
    "Silkstone-QLD",
    "Elsternwick-VIC",
    "Lewis Ponds-NSW",
    "Kalgoorlie-WA",
    "Baulkham Hills-NSW",
    "Fawkner-VIC",
    "Albany-WA",
    "Castle Hill-NSW",
    "Broken Hill-NSW",
    "Alice Springs-NT",
    "Martin-WA",
    "Victoria Park-WA",
    "Lytton-QLD",
    "Lakemba-NSW",
    "Hampton-VIC",
    "Moorina-QLD",
    "Pumpenbil-NSW",
    "Heatley-QLD",
    "Carina Heights-QLD",
    "Bondi Junction-NSW",
    "River Heads-QLD",
    "Belmont-VIC",
    "Goodna-QLD",
    "Seaford-VIC",
    "Raymond Terrace-NSW",
    "Camberwell-VIC",
    "Kurnell-NSW",
    "Altona North-VIC",
    "Maryborough-QLD",
    "Ridgewood-WA",
    "Kirwan-QLD",
    "Bathampton-NSW",
    "Essendon-VIC",
    "Koorainghat-NSW",
    "Woolloomooloo-NSW",
    "Maitland-NSW",
    "Maroota-NSW",
    "Ethelton-SA",
    "Cannonvale-QLD",
    "Elizabeth East-SA",
    "Gympie-QLD",
    "Glenorchy-TAS",
    "Briar Hill-VIC",
    "Campsie-NSW",
    "Macquarie Fields-NSW",
    "Rythdale-VIC",
    "Northam-WA",
    "Ashburton-VIC",
    "Kiamba-QLD",
    "St Marys-NSW",
    "Lewisham-NSW",
    "Christies Beach-SA",
    "Murray Bridge-SA",
    "Bowral-NSW",
    "Lyons-NT",
    "Carrum Downs-VIC",
    "Abbotsford-VIC",
    "Rosebud-VIC",
    "Lithgow-NSW",
    "Forest Glen-QLD",
    "Kings Langley-NSW",
    "Wandal-QLD",
    "Forest Lodge-NSW",
    "Grose Vale-NSW",
    "Port Melbourne-VIC",
    "Taigum-QLD",
    "Canton Beach-NSW",
    "Epping-NSW",
    "Mile End-SA",
    "Geelong West-VIC",
    "Frankston North-VIC",
    "Moe-VIC",
    "Gosnells-WA",
    "Mornington-VIC",
    "Hampton Park-VIC",
    "Woolloongabba-QLD",
    "Paddington-NSW",
    "The Entrance-NSW",
    "Banora Point-NSW",
    "Lawnton-QLD",
    "Iveragh-QLD",
    "Strathfield-NSW",
    "Embleton-WA",
    "Katoomba-NSW",
    "Townsville City-QLD",
    "Northbridge-WA",
    "Endeavour Hills-VIC",
    "Maylands-WA",
    "Armadale-WA",
    "Exford-VIC",
    "Moonee Ponds-VIC",
    "Healesville-VIC",
    "Bentley-WA",
    "Caloundra-QLD",
    "Doonside-NSW",
    "Browns Plains-QLD",
    "Caulfield East-VIC",
    "Hamilton East-NSW",
    "Doncaster East-VIC",
    "Dean Park-NSW",
    "Guildford-NSW",
    "Hastings-VIC",
    "Narangba-QLD",
    "Bathurst-NSW",
    "Kilsyth-VIC",
    "Waterways-VIC",
    "Hornsby-NSW",
    "Haymarket-NSW",
    "Bilinga-QLD",
    "Beard-ACT",
    "Alexandria-NSW",
    "Victoria Point-QLD",
    "Greenwich-NSW",
    "Sunshine Beach-QLD",
    "Edinburgh North-SA",
    "Lockyer-WA",
    "Greensborough-VIC",
    "Griffith-NSW",
    "Connolly-WA",
    "Devonport-TAS",
    "Uleybury-SA",
    "Bellimbopinni-NSW",
    "Morley-WA",
    "Logan-VIC",
    "Pascoe Vale-VIC",
    "Maryland-NSW",
    "Batemans Bay-NSW",
    "Hazelwood-VIC",
    "Hammond Park-WA",
    "West Wodonga-VIC",
    "Bruce-ACT",
    "Hamilton-QLD",
    "Elizabeth-SA",
    "Marangaroo-WA",
    "Wallsend-NSW",
    "Wavell Heights-QLD",
    "Modbury North-SA",
    "Ciccone-NT",
    "Milton-QLD",
    "Mentone-VIC",
    "Kedron-QLD",
    "Traralgon-VIC",
    "South Kingsville-VIC",
    "Allandale-NSW",
    "Doncaster-VIC",
    "Kangaroo Point-QLD",
    "Rockyview-QLD",
    "Toorak-VIC",
    "Moorabbin-VIC",
    "Acton-ACT",
    "Kallangur-QLD",
    "Cabramatta-NSW",
    "Kelvin Grove-QLD",
    "Bom Bom-NSW",
    "Fishermans Pocket-QLD",
    "Molendinar-QLD",
    "Darra-QLD",
    "Whyalla-SA",
    "Airport West-VIC",
    "Merrylands West-NSW",
    "Burwood East-VIC",
    "Port Hedland-WA",
    "Runcorn-QLD",
    "Collingwood Park-QLD",
    "Coogee-NSW",
    "Subiaco-WA",
    "Ermington-NSW",
    "Caveat-VIC",
    "North Lakes-QLD",
    "North Parramatta-NSW",
    "Merrylands-NSW",
    "Canning Vale-WA",
    "Box Hill North-VIC",
    "Belmont South-NSW",
    "Heathmont-VIC",
    "Mandurah-WA",
    "West Perth-WA",
    "Moorabbin Airport-VIC",
    "Forest Lake-QLD",
    "St Helens-TAS",
    "Esperance-WA",
    "Priestdale-QLD",
    "Coburg North-VIC",
    "Toowoomba City-QLD",
    "Ainslie-ACT",
    "Caulfield North-VIC",
    "Yarralumla-ACT",
    "Medlow Bath-NSW",
    "Sutherland-NSW",
    "Burrier-NSW",
    "Horsham-VIC",
    "Morphettville-SA",
    "Summer Hill-NSW",
    "Thornlie-WA",
    "Edgeworth-NSW",
    "Miranda-NSW",
    "Ranken-NT",
    "Kewarra Beach-QLD",
    "Woonona-NSW",
    "Bacchus Marsh-VIC",
    "Kooragang-NSW",
    "Chelsea Heights-VIC",
    "Busselton-WA",
    "Wonthaggi-VIC",
    "Windsor-QLD",
    "Montmorency-VIC",
    "Daylesford-VIC",
    "Knoxfield-VIC",
    "Blackett-NSW",
    "Patho-VIC",
    "Toronto-NSW",
    "Queanbeyan-NSW",
    "Daisy Hill-VIC",
    "Yagoona-NSW",
    "Mudgee-NSW",
    "Bona Vista-VIC",
    "Armidale-NSW",
    "Diamond Creek-VIC",
    "Sherwood-QLD",
    "Findon-SA",
    "Koonawarra-NSW",
    "Raby-NSW",
    "Punchbowl-NSW",
    "Mooroolbark-VIC",
    "Kensington-NSW",
    "Bulleen-VIC",
    "Asquith-NSW",
    "Baldivis-WA",
    "Fraser-ACT",
    "Coorparoo-QLD",
    "Brocklehurst-NSW",
    "East Bairnsdale-VIC",
    "Macleod-VIC",
    "Annerley-QLD",
    "Mulgrave-VIC",
    "East Geelong-VIC",
    "Ballarat Central-VIC",
    "Ashendon-WA",
    "Mirrabooka-WA",
    "Glen Waverley-VIC",
    "Bass Hill-NSW",
    "Dolans Bay-NSW",
    "Monteith-SA",
    "Keysborough-VIC",
    "Balmain-NSW",
    "Moorooka-QLD",
    "Cannington-WA",
    "Forster-NSW",
    "Primbee-NSW",
    "Matraville-NSW",
    "Oak Flats-NSW",
    "Kareela-NSW",
    "Altona-VIC",
    "Erskine Park-NSW",
    "Whittlesea-VIC",
    "Dee Why-NSW",
    "Paradise Point-QLD",
    "Katherine-NT",
    "Grange-QLD",
    "Rivervale-WA",
    "Patterson Lakes-VIC",
    "Bayswater-WA",
    "Hawthorn East-VIC",
    "Melbourne Airport-VIC",
    "Goulburn-NSW",
    "Ivanhoe-VIC",
    "Varsity Lakes-QLD",
    "Kaloorup-WA",
    "Glengallan-QLD",
    "Lota-QLD",
    "Ferny Grove-QLD",
    "Ascot Vale-VIC",
    "Mernda-VIC",
    "Clifton Hill-VIC",
    "Kyeemagh-NSW",
    "Malvern East-VIC",
    "Dora Creek-NSW",
    "Wollert-VIC",
    "Zillmere-QLD",
    "Bonnet Bay-NSW",
    "Mascot-NSW",
    "Cannon Hill-QLD",
    "Tamworth-NSW",
    "Virginia-QLD",
    "Sandgate-QLD",
    "Forrestfield-WA",
    "Doveton-VIC",
    "Nollamara-WA",
    "Moree-NSW",
    "Kelso-QLD",
    "Toukley-NSW",
    "North Perth-WA",
    "West End-WA",
    "Amor-VIC",
    "Newcastle West-NSW",
    "Bonnyrigg-NSW",
    "Cranbourne East-VIC",
    "Eltham-VIC",
    "Nerang-QLD",
    "Mosman-NSW",
    "Seymour-VIC",
    "Bungendore-NSW",
    "Geraldton-WA",
    "Holroyd-NSW",
    "Allambie Heights-NSW",
    "Gawler-SA",
    "Yambulla-NSW",
    "Cape Schanck-VIC",
    "Yeerongpilly-QLD",
    "Bentleigh East-VIC",
    "Booval-QLD",
    "Cronulla-NSW",
    "Coopers Plains-QLD",
    "Woy Woy-NSW",
    "Rosanna-VIC",
    "Old Toongabbie-NSW",
    "Lake Illawarra-NSW",
    "Cranebrook-NSW",
    "Churchlands-WA",
    "Rochedale-QLD",
    "Keilor Lodge-VIC",
    "Yanchep-WA",
    "Lalor-VIC",
    "Woodroffe-NT",
    "Balwyn-VIC",
    "Moranbah-QLD",
    "Ringtail Creek-QLD",
    "Salisbury-QLD",
    "Bedford-WA",
    "Beverly Hills-NSW",
    "Morayfield-QLD",
    "Fairfield-QLD",
    "Aberdare-NSW",
    "Mount Cotton-QLD",
    "Eastlakes-NSW",
    "Quialigo-NSW",
    "Casino-NSW",
    "Aitkenvale-QLD",
    "Gilles Plains-SA",
    "Greenacre-NSW",
    "Babbage Island-WA",
    "Berkeley-NSW",
    "Jesmond-NSW",
    "Melton South-VIC",
    "West Leederville-WA",
    "Sun Valley-NSW",
    "Koolewong-NSW",
    "Marmong Point-NSW",
    "Modbury-SA",
    "St Marys-SA",
    "Mount Isa-QLD",
    "Fitzgibbon-QLD",
    "Castella-VIC",
    "Echuca-VIC",
    "Bentleigh-VIC",
    "Ashfield-WA",
    "Alexandra Hills-QLD",
    "Daceyville-NSW",
    "Acacia Gardens-NSW",
    "Kogarah-NSW",
    "Lower Wilmot-TAS",
    "Guerilla Bay-NSW",
    "Gordon-NSW",
    "Throssell-WA",
    "Uriarra Village-ACT",
    "Shoalwater-WA",
    "Minyama-QLD",
    "Colac-VIC",
    "Turner-ACT",
    "Meadowbank-NSW",
    "Springbrook-QLD",
    "Leeton-NSW",
    "Meadow Heights-VIC",
    "Bairnsdale-VIC",
    "Werrington-NSW",
    "Armadale-VIC",
    "East Ryde-NSW",
    "Westmeadows-VIC",
    "Hurlstone Park-NSW",
    "Tarragindi-QLD",
    "Dayton-WA",
    "Hervey Bay-QLD",
    "Hardys Bay-NSW",
    "Indooroopilly-QLD",
    "Mount Sheridan-QLD",
    "Quakers Hill-NSW",
    "Mount Gravatt-QLD",
    "Hughes-ACT",
    "Ardeer-VIC",
    "Oakdale-NSW",
    "Port Kennedy-WA",
    "Balga-WA",
    "Mount Eliza-VIC",
    "Meadowbrook-QLD",
    "Penshurst-NSW",
    "Jensen-QLD",
    "Wetherill Park-NSW",
    "Kingaroy-QLD",
    "Logan Reserve-QLD",
    "Gowanbrae-VIC",
    "Rum Jungle-NT",
    "Deniliquin-NSW",
    "Hermit Park-QLD",
    "Muswellbrook-NSW",
    "Colac East-VIC",
    "Beelbangera-NSW",
    "Hamilton-NSW",
    "Doyalson North-NSW",
    "Windsor-NSW",
    "South Wharf-VIC",
    "Tullamarine-VIC",
    "Haberfield-NSW",
    "Sandringham-VIC",
    "Bald Hills-QLD",
    "Kensington-VIC",
    "Mountain Creek-QLD",
    "McMahons Point-NSW",
    "Macgregor-QLD",
    "Herdsman-WA",
    "Ashgrove-QLD",
    "Noarlunga-SA",
    "Coolaroo-VIC",
    "Howrah-TAS",
    "Camden-NSW",
    "Canterbury-NSW",
    "Guanaba-QLD",
    "Ingleburn-NSW",
    "Red Hill-QLD",
    "Driver-NT",
    "Madeley-WA",
    "Lutwyche-QLD",
    "Brisbane Airport-QLD",
    "Tennant Creek-NT",
    "Quinns Rocks-WA",
    "Benalla-VIC",
    "Granville-NSW",
    "Redbank Plains-QLD",
    "Northgate-QLD",
    "Belhus-WA",
    "Erskineville-NSW",
    "Mayfield-NSW",
    "Windsor-VIC",
    "Wembley Downs-WA",
    "Baerami-NSW",
    "Rose Park-SA",
    "Drummoyne-NSW",
    "East Victoria Park-WA",
    "Clifton Springs-VIC",
    "Templestowe-VIC",
    "Highett-VIC",
    "Keperra-QLD",
    "Palm Beach-QLD",
    "Fitzgerald Creek-QLD",
    "Ryde-NSW",
    "Hallam-VIC",
    "Fitzroy Crossing-WA",
    "Pooraka-SA",
    "Balwyn North-VIC",
    "Croydon Park-NSW",
    "Bega-NSW",
    "Wantirna South-VIC",
    "Hendra-QLD",
    "The Gap-NSW",
    "Hamilton Valley-NSW",
    "Clayton South-VIC",
    "Georgetown-NSW",
    "Kingston-TAS",
    "Stawell-VIC",
    "Euroa-VIC",
    "Scoresby-VIC",
    "Jacana-VIC",
    "Toowong-QLD",
    "Mount Coolum-QLD",
    "Keilor East-VIC",
    "Ballajura-WA",
    "Hayters Hill-NSW",
    "Moe South-VIC",
    "Windale-NSW",
    "Tregear-NSW",
    "Chester Hill-NSW",
    "Belmore-NSW",
    "Carnarvon-WA",
    "Willow Creek-SA",
    "Kingston-ACT",
    "Springvale-VIC",
    "Berri-SA",
    "Attwood-VIC",
    "Belmont-WA",
    "Oakleigh East-VIC",
    "Kangaroo Gully-WA",
    "Maianbar-NSW",
    "Kempsey-NSW",
    "Noarlunga Centre-SA",
    "Orange Grove-NSW",
    "St Marys-TAS",
    "Ringwood East-VIC",
    "Eagleby-QLD",
    "Seven Hills-NSW",
    "Calwell-ACT",
    "Coomba Bay-NSW",
    "Redland Bay-QLD",
    "Birkdale-QLD",
    "Mareeba-QLD",
    "Beaumont Hills-NSW",
    "Toongabbie-NSW",
    "Caroline Springs-VIC",
    "Hambledon Hill-NSW",
    "Tarrawanna-NSW",
    "Croydon-SA",
    "St James-WA",
    "Harrington Park-NSW",
    "Campbellfield-VIC",
    "Valley View-SA",
    "Noosaville-QLD",
    "Strathfield South-NSW",
    "Bronte-NSW",
    "Chintin-VIC",
    "Yamba-NSW",
    "Murarrie-QLD",
    "Goondiwindi-QLD",
    "Portland-VIC",
    "Lugarno-NSW",
    "Heathpool-SA",
    "Rodd Point-NSW",
    "Merredin-WA",
    "Port Augusta-SA",
    "Avondale Heights-VIC",
    "Vermont-VIC",
    "Caerleon-NSW",
    "Kambah-ACT",
    "Bangor-NSW",
    "Rockdale-NSW",
    "Tin Can Bay-QLD",
    "Kingswood-NSW",
    "Langwarrin-VIC",
    "Brentwood-WA",
    "Burpengary-QLD",
    "Newcastle East-NSW",
    "Innaloo-WA",
    "Lilyfield-NSW",
    "Kinka Beach-QLD",
    "Sunshine North-VIC",
    "Beaconsfield-WA",
    "Woodville Gardens-SA",
    "Christie Downs-SA",
    "Kunioon-QLD",
    "Smithfield-NSW",
    "Elanora-QLD",
    "Inglewood-WA",
    "Westmead-NSW",
    "Rocky Point-QLD",
    "Annandale-NSW",
    "Aberglasslyn-NSW",
    "Winninowie-SA",
    "Slacks Creek-QLD",
    "Redcliffe-WA",
    "Ardmona-VIC",
    "Salisbury East-SA",
    "Tuggerah-NSW",
    "Tweed Heads South-NSW",
    "West Beach-SA",
    "Tongarra-NSW",
    "Montrose-VIC",
    "Hopetoun Park-VIC",
    "Lake Gardens-VIC",
    "Melton West-VIC",
    "Lenaghan-NSW",
    "Piccadilly-WA",
    "Albanvale-VIC",
    "Tahmoor-NSW",
    "Qualco-SA",
    "Osborne Park-WA",
    "Camp Hill-QLD",
    "Carina-QLD",
    "Wellington Point-QLD",
    "Greenwood-WA",
    "Mont Albert-VIC",
    "Hallora-VIC",
    "Gulmarrad-NSW",
    "Londonderry-NSW",
    "Maddington-WA",
    "Burwood Heights-NSW",
    "Blackburn South-VIC",
    "Narromine-NSW",
    "Huonville-TAS",
    "St Ives-NSW",
    "Bergalia-NSW",
    "Kotara-NSW",
    "Oxley-QLD",
    "Goonellabah-NSW",
    "Leda-WA",
    "West Hindmarsh-SA",
    "Homebush West-NSW",
    "Banyo-QLD",
    "Claymore-NSW",
    "Woodcroft-SA",
    "Greenway-ACT",
    "Willoughby East-NSW",
    "Semaphore Park-SA",
    "Milvale-NSW",
    "Blair Athol-SA",
    "Nundah-QLD",
    "Shailer Park-QLD",
    "Ulverstone-TAS",
    "Coober Pedy-SA",
    "Crib Point-VIC",
    "Mitchelton-QLD",
    "Erindale-SA",
    "Rosebery-NSW",
    "Croydon-NSW",
    "Ramsgate-NSW",
    "Gatton-QLD",
    "Dripstone-NSW",
    "Hatton Vale-QLD",
    "Joondanna-WA",
    "Maraylya-NSW",
    "Warragul-VIC",
    "Queenscliff-VIC",
    "Murrumbeena-VIC",
    "Humevale-VIC",
    "Wolli Creek-NSW",
    "Mount Peter-QLD",
    "Corio-VIC",
    "Warradale-SA",
    "Cowra-NSW",
    "Essendon Fields-VIC",
    "Mullaquana-SA",
    "Jewells-NSW",
    "Cooma-NSW",
    "Upper Kedron-QLD",
    "Wooloowin-QLD",
    "Heathwood-QLD",
    "Ashwood-VIC",
    "Algester-QLD",
    "Angourie-NSW",
    "Bundalong-VIC",
    "Dublin-SA",
    "Barren Grounds-NSW",
    "Oberon-NSW",
    "Abbotsbury-NSW",
    "Petrie-QLD",
    "Tempe-NSW",
    "Altona Meadows-VIC",
    "Pound Creek-VIC",
    "Coolangatta-QLD",
    "Lidcombe-NSW",
    "Swan Hill-VIC",
    "Shoalwater-QLD",
    "Narrogin-WA",
    "Carlingford-NSW",
    "Carrara-QLD",
    "Queens Park-NSW",
    "Jolimont-WA",
    "Palmerston-ACT",
    "Menora-WA",
    "Glenfield-NSW",
    "Tuggeranong-ACT",
    "Rifle Range-QLD",
    "Melrose Park-SA",
    "Caulfield South-VIC",
    "Willowra-NT",
    "Hillcrest-TAS",
    "Currumbin-QLD",
    "Lower Broughton-SA",
    "Holmesville-NSW",
    "Rossbridge-VIC",
    "Hackham-SA",
    "St Lucia-QLD",
    "Polo Flat-NSW",
    "Loganholme-QLD",
    "Seacombe Gardens-SA",
    "Belgrave South-VIC",
    "Noosa Heads-QLD",
    "Queenscliff-NSW",
    "Elizabeth South-SA",
    "Yagaburne-QLD",
    "Helensvale-QLD",
    "Daglish-WA",
    "Inverell-NSW",
    "Seaford Meadows-SA",
    "Delahey-VIC",
    "St Clair-SA",
    "Como-WA",
    "Jamboree Heights-QLD",
    "Strahan-TAS",
    "Boambee East-NSW",
    "Neerabup-WA",
    "Hamilton North-NSW",
    "Beechboro-WA",
    "Crooble-NSW",
    "North Sydney-NSW",
    "Watsons Bay-NSW",
    "Catherine Hill Bay-NSW",
]
