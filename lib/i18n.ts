export const LANGS = [
  { code: "en", label: "English", flag: "🇿🇦" },
  { code: "af", label: "Afrikaans", flag: "🇿🇦" },
  { code: "zu", label: "isiZulu", flag: "🇿🇦" },
  { code: "xh", label: "isiXhosa", flag: "🇿🇦" },
]

export const translations: Record<string, Record<string, string>> = {
  en: {
    dashboard:"Dashboard", fleet:"Fleet Tracking", orders:"Orders", drivers:"Drivers", analytics:"Analytics",
    warehouses:"Warehouses", inventory:"Inventory", barcode:"Barcode Scanner", fuel:"Fuel", maintenance:"Maintenance",
    invoices:"Invoices", costanalysis:"Cost Analysis", hubs:"Hub Network", routeoptimizer:"Route Optimizer",
    geofences:"Geofencing", returns:"Returns", forecast:"Demand Forecast", mlmaintenance:"ML Maintenance",
    telematics:"Telematics/IoT", courierfederation:"Courier Federation", aiagents:"AI Agents",
    teamchat:"Team Chat", pod:"Proof of Delivery", notifications:"Notifications",
    apidocs:"API Docs", testing:"Testing", monitoring:"Monitoring", livemap:"Live Map", driverapp:"Driver App",
    newOrder:"+ New Order", signOut:"Sign Out", welcome:"Welcome back",
    totalVehicles:"Total Vehicles", activeDrivers:"Active Drivers", totalOrders:"Total Orders", successRate:"Success Rate",
    onRoute:"On Route", available:"Available", completed:"Completed", pending:"Pending",
    addDriver:"Add Driver", addVehicle:"Add Vehicle", save:"Save", cancel:"Cancel",
  },
  af: {
    dashboard:"Kontroleskerm", fleet:"Vloot Opsporing", orders:"Bestellings", drivers:"Bestuurders", analytics:"Analise",
    warehouses:"Pakhuise", inventory:"Voorraad", barcode:"Strepieskode", fuel:"Brandstof", maintenance:"Onderhoud",
    invoices:"Fakture", costanalysis:"Koste-analise", hubs:"Knooppunte", routeoptimizer:"Roete-optimeerder",
    geofences:"Geoheinings", returns:"Terugsendings", forecast:"Aanvraagvoorspelling", mlmaintenance:"ML Onderhoud",
    telematics:"Telematika", courierfederation:"Koeriersfederasie", aiagents:"KI Agente",
    teamchat:"Spangesels", pod:"Bewys van Aflewering", notifications:"Kennisgewings",
    apidocs:"API Dokumentasie", testing:"Toetsing", monitoring:"Monitering", livemap:"Lewendige Kaart", driverapp:"Bestuurder-app",
    newOrder:"+ Nuwe Bestelling", signOut:"Teken Uit", welcome:"Welkom terug",
    totalVehicles:"Totale Voertuie", activeDrivers:"Aktiewe Bestuurders", totalOrders:"Totale Bestellings", successRate:"Sukseskoers",
    onRoute:"Op Roete", available:"Beskikbaar", completed:"Voltooi", pending:"Hangende",
    addDriver:"Voeg Bestuurder By", addVehicle:"Voeg Voertuig By", save:"Stoor", cancel:"Kanselleer",
  },
  zu: {
    dashboard:"Ikhompiyutha", fleet:"Ukulandela Imoto", orders:"Izicelo", drivers:"Abashayeli", analytics:"Ukuhlaziya",
    warehouses:"Izindawo Zokugcina", inventory:"Impahla", barcode:"Isikeni", fuel:"Uphethiloli", maintenance:"Ukunakekela",
    invoices:"Izinwadi", costanalysis:"Ukuhlaziya Izindleko", hubs:"Amahhabu", routeoptimizer:"Ukusulela Indlela",
    geofences:"Izindawo Ezivaliwe", returns:"Izibuyiso", forecast:"Isifinyezo Sezicelo", mlmaintenance:"ML Ukunakekela",
    telematics:"Telematics", courierfederation:"Abahambisi", aiagents:"I-AI Agents",
    teamchat:"Ingxoxo Yeqembu", pod:"Ubufakazi Bokuhambisa", notifications:"Izaziso",
    apidocs:"Imibhalo ye-API", testing:"Ukuhlola", monitoring:"Ukuqapha", livemap:"Imapa Ephilayo", driverapp:"Uhlelo Lomshayeli",
    newOrder:"+ Isicelo Esisha", signOut:"Phuma", welcome:"Wamukelekile futhi",
    totalVehicles:"Izimoto Zonke", activeDrivers:"Abashayeli Abakhona", totalOrders:"Izicelo Zonke", successRate:"Izinga Lempumelelo",
    onRoute:"Endleleni", available:"Iyatholakala", completed:"Kuqediwe", pending:"Kulindile",
    addDriver:"Engeza Umshayeli", addVehicle:"Engeza Imoto", save:"Gcina", cancel:"Khansela",
  },
  xh: {
    dashboard:"Ibhodi Yokulawula", fleet:"Ukulandela Imoto", orders:"Imiyalelo", drivers:"Abaqhubi", analytics:"Uhlalutyo",
    warehouses:"Iindawo Zokugcina", inventory:"Impahla", barcode:"Isikena", fuel:"Uphethiloli", maintenance:"Unyango",
    invoices:"Iifaktura", costanalysis:"Uhlalutyo Lwezindleko", hubs:"Iihhabu", routeoptimizer:"Ukulungisa Indlela",
    geofences:"Iindawo Ezivaliwe", returns:"Izibuyiso", forecast:"Isalathiso Sezicelo", mlmaintenance:"ML Unyango",
    telematics:"Telematics", courierfederation:"Abathumeli", aiagents:"AI Agents",
    teamchat:"Ingxoxo Yeqela", pod:"Ubungqina Bokuhanjiswa", notifications:"Izaziso",
    apidocs:"Imibhalo ye-API", testing:"Uvavanyo", monitoring:"Ukulinda", livemap:"Mapa Ephilayo", driverapp:"Uhlelo Lomqhubi",
    newOrder:"+ Umyalelo Omtsha", signOut:"Phuma", welcome:"Wamkelekile kwakhona",
    totalVehicles:"Zonke Izithuthi", activeDrivers:"Abaqhubi Abakhona", totalOrders:"Yonke Imiyalelo", successRate:"Iqondo Lempumelelo",
    onRoute:"Endleleni", available:"Iyafumaneka", completed:"Igqityiwe", pending:"Ilindile",
    addDriver:"Yongeza Umqhubi", addVehicle:"Yongeza Isithuthi", save:"Gcina", cancel:"Rhoxisa",
  },
}

export function t(key: string, lang: string = "en"): string {
  const k = key.replace(/-/g,"").toLowerCase()
  return translations[lang]?.[k] || translations.en[k] || key
}
