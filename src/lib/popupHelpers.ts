import esri = __esri;

export function createISOPopup(graphic: esri.Graphic): HTMLElement {
  const div = document.createElement("div");
  const a = graphic.attributes;
  const string = `<p>${a.CONTOUR.toFixed(2)} inches</p>`;
  div.innerHTML = string;
  return div;
}

export function createImpairmentPopup(graphic: esri.Graphic): HTMLElement {
  const div = document.createElement("div");
  const a = graphic.attributes;
  const dimension = a.SIZE_ASSESSED_UNIT === "Acres" ? "area" : "length";
  const string = `
    <h3>${a.WBNAME}</h3>
    <p>Water body type: ${a.WBTYPE}</br>
    Assessed ${dimension}: ${a.EST_SIZE_ASSESSED} ${a.SIZE_ASSESSED_UNIT}</br>
    <a href="https://www.waterboards.ca.gov/water_issues/programs/tmdl/2014_16state_ir_reports/category${a.INT_REPORT_CATEGORY}_report.shtml">Integrated Report category: ${a.INT_REPORT_CATEGORY}</a></br>
    <span class="italic">Assessed water body in the ${a.REGION_NAME} region</span></p>
  `;
  div.innerHTML = string;
  return div;
}

export function createResourcesPopup(
  graphic: esri.Graphic,
  includeCity: boolean
): string {
  const attributes = graphic.attributes;
  const city = attributes.CITY;
  let string = `<ul>`;
  string = includeCity ? `${city}</br>` + string : string;
  const links = [
    attributes.link1,
    attributes.link2,
    attributes.link3,
    attributes.link4,
    attributes.link5,
    attributes.link6,
  ];
  const labels = [
    attributes.link1_label,
    attributes.link2_label,
    attributes.link3_label,
    attributes.link4_label,
    attributes.link5_label,
    attributes.link6_label,
  ];

  links
    .filter((link) => link && link.trim())
    .forEach((link, index) => {
      string = string + `<li><a href='${link}'>${labels[index]}</a></li>`;
    });

  string = string + "</ul>";
  return string;
}

export function createRSBTracePopup(graphic: esri.Graphic): string {
  const attributes = graphic?.attributes;
  const destLookup = [
    { to: "The Pacific Ocean", watershed: "Aliso" },
    {
      to: "Anaheim Bay / Huntingon Harbor",
      watershed: "Anaheim Bay",
    },
    { to: "Newport Bay", watershed: "Newport Bay" },
    { to: "The Pacific Ocean", watershed: "Coyote Creek" },
    { to: "The Pacific Ocean", watershed: "Dana Point" },
    { to: "The Pacific Ocean", watershed: "Laguna Coast" },
    { to: "The Pacific Ocean", watershed: "Newport Coastal" },
    { to: "The Pacific Ocean", watershed: "San Clemente" },
    { to: "The Pacific Ocean", watershed: "San Juan Creek" },
    { to: "The Pacific Ocean", watershed: "San Mateo" },
    { to: "The Pacific Ocean", watershed: "Santa Ana River" },
  ];

  const dest = destLookup.find((el) => el.watershed === attributes.Watershed);
  const string = `<p>Trace originated in Subbasin <strong>#${
    attributes.CatchIDN
  }</strong> 
    is part of the <strong>${
      attributes.Watershed
    }</strong> watershed, and drains to <strong>${dest!["to"]}</strong>.</p>`;

  return string;
}

export function createRSBPopup(graphic: esri.Graphic): string {
  const attributes = graphic?.attributes;
  const destLookup = [
    { to: "The Pacific Ocean", watershed: "Aliso" },
    {
      to: "Anaheim Bay / Huntingon Harbor",
      watershed: "Anaheim Bay",
    },
    { to: "Newport Bay", watershed: "Newport Bay" },
    { to: "The Pacific Ocean", watershed: "Coyote Creek" },
    { to: "The Pacific Ocean", watershed: "Dana Point" },
    { to: "The Pacific Ocean", watershed: "Laguna Coast" },
    { to: "The Pacific Ocean", watershed: "Newport Coastal" },
    { to: "The Pacific Ocean", watershed: "San Clemente" },
    { to: "The Pacific Ocean", watershed: "San Juan Creek" },
    { to: "The Pacific Ocean", watershed: "San Mateo" },
    { to: "The Pacific Ocean", watershed: "Santa Ana River" },
  ];

  const dest = destLookup.find((el) => el.watershed === attributes.Watershed);
  const string = `<p>Subbasin <strong>#${attributes.CatchIDN}</strong> 
    is <strong>${Math.round(
      attributes.AreaAcre
    )}</strong> acres in size, is part of the <strong>${
    attributes.Watershed
  }</strong> watershed, and drains to <strong>${dest!["to"]}</strong>.</p>`;

  return string;
}
