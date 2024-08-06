export const source = 'https://qsgbcz.lmnas.com/login#login';
export const target = 'https://qsgbcz.lmnas.com/app/design/new-design-1';
// export const source = '/login#login';
// export const target = '/app/design/new-design-1';
export const date = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
}).replace(/\//g, '.');
export const factory1 = 'RGB';
export const transformertype1 = 'DTTHDG';
export const rating = '2000';
export const notinRangehv = '40000';
export const inRangehv = '5000'; 
export const highestOperationVoltagehv = '7.2';
export const acPhasehv = '20';
export const liPhase = '60';
export const hv1 = '5000';
export const hv2 = '4600';
export const notinRangelv = '2000';
export const inRangelv = '750';
export const highestOperationVoltagelv = '1.1';
export const acPhaselv = '3';
export const typeOfLv = 'Prepreg';
export const vectorGroup = 'Dyn1';
export const lv1 = '600';
export const lv2 = '570';
export const notinRangethdi = '220';
export const inRangethdi = '20';
export const ipProtection = 'IP00';
export const electrostaticscreen = '0';
export const notinRangeuk = '12';
export const inRangeuk = '8';  
export const insulationClass = 'F';
export const windingMaterial = 'Al';
export const rating1 = '1000';
export const rating2 = '1000';
export const uk1 = '8';
export const uk2 = '6';
export const vectorGroup1 = 'Dyn1';
export const vectorGroup2 = 'Dyn1';
export const lwaforRGB = '69';
export const lpaforRGB = '67';
//NEU Factory
export const factory2 = 'NEU';
export const transformertype2 = 'DOTDG';
export const notinRangehvforNEU = '40000';
export const inRangehvforNEU  = '3000'; 
export const highestOperationVoltagehvforNEU = '3.6';
export const acPhasehvforNEU = '10';
export const liPhaseforNEU = '20';
export const bushingshv = 'Standard';
export const notinRangelvforNEU = '1000';
export const inRangelvforNEU = '600';
export const tappingplus = '2';
export const tappingplusstep = '2,5';
export const tappingminus = '2';
export const tappingminusstep = '2,5';
export const temperaturerise = '100,0';
export const ambentMaxTemp = '40,0';
export const MaxTemp1 = '67,0';
export const maxAvgTempPerYear = '47,0';
export const installionHeight = 'max 1000 m above see level';
export const temperatureRiseOil = '60,00';
export const climateClass = 'C2';
export const environmentalClass = 'E2';
export const tempRiseDatasheet = '100';
export const maxAvgTempPerMonth = '57,0';
export const tempRiseWinding = '65,00';
export const tempRiseGitra = '100';

//SGBCZ
export const factory3 = 'SGBCZ';
export const transformertype3 = 'DTTHZ2N';
export const highestOperationVoltagehvforSGBCZ = '3.6';
export const acPhasehvforSGBCZ = '10';
export const liPhaseforSGBCZ = '20';
export const inRangelvSGBCZ = '450';
export const notinRangelvSGBCZ = '950';
export const notinRangeukforSGBCZ = '12';
export const inRangeukforSGBCZ = '6';  
export const impendanceTolerance = '10%';
export const noLoadLossGuarantee = '2340';
export const loadLossGuatantee = '16000';
export const referenceTemplate = '120';
export const lwa = '69';
export const lpaisDesign = '0';
export const lpaDistance = '1';
export const tolerance = '0';
export const hvisDesign = '25000';


// export const target1 = '/app/design';
export const target1 = 'https://qsgbcz.lmnas.com/app/design'
//export const xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<sgb version=\"\" datum=\"\">\n\t<TGtExportEDS nodetype=\"class\">\n\t\t<emailadresse nodetype=\"property\" datatype=\"xs:string\">deploymentmaster@lmnas.com</emailadresse>\n\t\t<frequenz nodetype=\"property\" datatype=\"xs:double\">50</frequenz>\n\t\t<v_ausw_gleichrichterbetrieb nodetype=\"property\" datatype=\"xs:long\">6396</v_ausw_gleichrichterbetrieb>\n\t\t<p0_garantie nodetype=\"property\" datatype=\"xs:long\">2340</p0_garantie>\n\t\t<p0_garantie_toleranz nodetype=\"property\" datatype=\"xs:double\">0</p0_garantie_toleranz>\n\t\t<pk_garantie nodetype=\"property\" datatype=\"xs:long\">16000</pk_garantie>\n\t\t<pk_garantie_toleranz nodetype=\"property\" datatype=\"xs:double\">0</pk_garantie_toleranz>\n\t\t<pk_bezugstemperatur nodetype=\"property\" datatype=\"xs:long\">120</pk_bezugstemperatur>\n\t\t<uk_garantie nodetype=\"property\" datatype=\"xs:double\">6</uk_garantie>\n\t\t<uk_garantie_toleranz nodetype=\"property\" datatype=\"xs:double\">10</uk_garantie_toleranz>\n\t\t<lwa_garantie nodetype=\"property\" datatype=\"xs:long\">69</lwa_garantie>\n\t\t<lpa_garantie nodetype=\"property\" datatype=\"xs:long\">0</lpa_garantie>\n\t\t<geraeusch_entfernung nodetype=\"property\" datatype=\"xs:double\">0</geraeusch_entfernung>\n\t\t<geraeusch_toleranz nodetype=\"property\" datatype=\"xs:long\">0</geraeusch_toleranz>\n\t\t<TGtExportEDSAuftragSystemeListe nodetype=\"classlist\">\n\t\t\t<TGtExportEDSAuftragSystem nodetype=\"class\">\n\t\t\t\t<v_ausw_system nodetype=\"property\" datatype=\"xs:long\">146</v_ausw_system>\n\t\t\t\t<nennleistung nodetype=\"property\" datatype=\"xs:long\">2000</nennleistung>\n\t\t\t\t<nennspannung nodetype=\"property\" datatype=\"xs:double\">20000</nennspannung>\n\t\t\t\t<v_ausw_schaltung nodetype=\"property\" datatype=\"xs:long\">420</v_ausw_schaltung>\n\t\t\t\t<v_ausw_sternpunkt nodetype=\"property\" datatype=\"xs:long\">457</v_ausw_sternpunkt>\n\t\t\t\t<stundenziffer nodetype=\"property\" datatype=\"xs:long\">0</stundenziffer>\n\t\t\t\t<blitzstossspg_pruef_phase nodetype=\"property\" datatype=\"xs:long\">95</blitzstossspg_pruef_phase>\n\t\t\t\t<wechselspg_pruef_phase_1000 nodetype=\"property\" datatype=\"xs:double\">50</wechselspg_pruef_phase_1000>\n\t\t\t\t<zulaessige_erwaermung_1000 nodetype=\"property\" datatype=\"xs:double\">100</zulaessige_erwaermung_1000>\n\t\t\t\t<TGtExportEDSAuftragStellungenListe nodetype=\"classlist\">\n\t\t\t\t\t<TGtExportEDSAuftragStellung nodetype=\"class\">\n\t\t\t\t\t\t<spannung nodetype=\"property\" datatype=\"xs:double\">20000</spannung>\n\t\t\t\t\t</TGtExportEDSAuftragStellung>\n\t\t\t\t\t<TGtExportEDSAuftragStellung nodetype=\"class\">\n\t\t\t\t\t\t<spannung nodetype=\"property\" datatype=\"xs:double\">19500</spannung>\n\t\t\t\t\t</TGtExportEDSAuftragStellung>\n\t\t\t\t\t<TGtExportEDSAuftragStellung nodetype=\"class\">\n\t\t\t\t\t\t<spannung nodetype=\"property\" datatype=\"xs:double\">19000</spannung>\n\t\t\t\t\t</TGtExportEDSAuftragStellung>\n\t\t\t\t\t<TGtExportEDSAuftragStellung nodetype=\"class\">\n\t\t\t\t\t\t<spannung nodetype=\"property\" datatype=\"xs:double\">20500</spannung>\n\t\t\t\t\t</TGtExportEDSAuftragStellung>\n\t\t\t\t\t<TGtExportEDSAuftragStellung nodetype=\"class\">\n\t\t\t\t\t\t<spannung nodetype=\"property\" datatype=\"xs:double\">21000</spannung>\n\t\t\t\t\t</TGtExportEDSAuftragStellung>\n\t\t\t\t</TGtExportEDSAuftragStellungenListe>\n\t\t\t</TGtExportEDSAuftragSystem>\n\t\t\t<TGtExportEDSAuftragSystem nodetype=\"class\">\n\t\t\t\t<v_ausw_system nodetype=\"property\" datatype=\"xs:long\">147</v_ausw_system>\n\t\t\t\t<nennleistung nodetype=\"property\" datatype=\"xs:long\">2000</nennleistung>\n\t\t\t\t<nennspannung nodetype=\"property\" datatype=\"xs:double\">440</nennspannung>\n\t\t\t\t<v_ausw_schaltung nodetype=\"property\" datatype=\"xs:long\">419</v_ausw_schaltung>\n\t\t\t\t<v_ausw_sternpunkt nodetype=\"property\" datatype=\"xs:long\">458</v_ausw_sternpunkt>\n\t\t\t\t<stundenziffer nodetype=\"property\" datatype=\"xs:long\">5</stundenziffer>\n\t\t\t\t<blitzstossspg_pruef_phase nodetype=\"property\" datatype=\"xs:long\">0</blitzstossspg_pruef_phase>\n\t\t\t\t<wechselspg_pruef_phase_1000 nodetype=\"property\" datatype=\"xs:double\">3</wechselspg_pruef_phase_1000>\n\t\t\t\t<zulaessige_erwaermung_1000 nodetype=\"property\" datatype=\"xs:double\">100</zulaessige_erwaermung_1000>\n\t\t\t\t<TGtExportEDSAuftragStellungenListe nodetype=\"classlist\">\n\t\t\t\t\t<TGtExportEDSAuftragStellung nodetype=\"class\">\n\t\t\t\t\t\t<spannung nodetype=\"property\" datatype=\"xs:double\">440</spannung>\n\t\t\t\t\t</TGtExportEDSAuftragStellung>\n\t\t\t\t</TGtExportEDSAuftragStellungenListe>\n\t\t\t</TGtExportEDSAuftragSystem>\n\t\t</TGtExportEDSAuftragSystemeListe>\n\t</TGtExportEDS>\n</sgb>"

export const designid = 'DTTHZ2N20230021';

export const expectedXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sgb version="" datum="">
    <TGtExportEDS nodetype="class">
        <emailadresse nodetype="property" datatype="xs:string">wesupport@lmnas.com</emailadresse>
        <frequenz nodetype="property" datatype="xs:double">50</frequenz>
        <v_ausw_gleichrichterbetrieb nodetype="property" datatype="xs:long">No</v_ausw_gleichrichterbetrieb>
        <p0_garantie nodetype="property" datatype="xs:long">2340</p0_garantie>
        <p0_garantie_toleranz nodetype="property" datatype="xs:double">0</p0_garantie_toleranz>
        <pk_garantie nodetype="property" datatype="xs:long">16000</pk_garantie>
        <pk_garantie_toleranz nodetype="property" datatype="xs:double">0</pk_garantie_toleranz>
        <pk_bezugstemperatur nodetype="property" datatype="xs:long">120</pk_bezugstemperatur>
        <uk_garantie nodetype="property" datatype="xs:double">6</uk_garantie>
        <uk_garantie_toleranz nodetype="property" datatype="xs:double">10</uk_garantie_toleranz>
        <lwa_garantie nodetype="property" datatype="xs:long">69</lwa_garantie>
        <lpa_garantie nodetype="property" datatype="xs:long">0</lpa_garantie>
        <geraeusch_entfernung nodetype="property" datatype="xs:double">0</geraeusch_entfernung>
        <geraeusch_toleranz nodetype="property" datatype="xs:long">0</geraeusch_toleranz>
        <TGtExportEDSAuftragSystemeListe nodetype="classlist">
            <TGtExportEDSAuftragSystem nodetype="class">
                <v_ausw_system nodetype="property" datatype="xs:long">146</v_ausw_system>
                <nennleistung nodetype="property" datatype="xs:long">2000</nennleistung>
                <nennspannung nodetype="property" datatype="xs:double">20000</nennspannung>
                <v_ausw_schaltung nodetype="property" datatype="xs:long">420</v_ausw_schaltung>
                <v_ausw_sternpunkt nodetype="property" datatype="xs:long">457</v_ausw_sternpunkt>
                <stundenziffer nodetype="property" datatype="xs:long">0</stundenziffer>
                <blitzstossspg_pruef_phase nodetype="property" datatype="xs:long">95</blitzstossspg_pruef_phase>
                <wechselspg_pruef_phase_1000 nodetype="property" datatype="xs:double">50</wechselspg_pruef_phase_1000>
                <zulaessige_erwaermung_1000 nodetype="property" datatype="xs:double">100</zulaessige_erwaermung_1000>
                <TGtExportEDSAuftragStellungenListe nodetype="classlist">
                    <TGtExportEDSAuftragStellung nodetype="class">
                        <spannung nodetype="property" datatype="xs:double">20000</spannung>
                    </TGtExportEDSAuftragStellung>
                    <TGtExportEDSAuftragStellung nodetype="class">
                        <spannung nodetype="property" datatype="xs:double">19500</spannung>
                    </TGtExportEDSAuftragStellung>
                    <TGtExportEDSAuftragStellung nodetype="class">
                        <spannung nodetype="property" datatype="xs:double">19000</spannung>
                    </TGtExportEDSAuftragStellung>
                    <TGtExportEDSAuftragStellung nodetype="class">
                        <spannung nodetype="property" datatype="xs:double">20500</spannung>
                    </TGtExportEDSAuftragStellung>
                    <TGtExportEDSAuftragStellung nodetype="class">
                        <spannung nodetype="property" datatype="xs:double">21000</spannung>
                    </TGtExportEDSAuftragStellung>
                </TGtExportEDSAuftragStellungenListe>
            </TGtExportEDSAuftragSystem>
            <TGtExportEDSAuftragSystem nodetype="class">
                <v_ausw_system nodetype="property" datatype="xs:long">147</v_ausw_system>
                <nennleistung nodetype="property" datatype="xs:long">2000</nennleistung>
                <nennspannung nodetype="property" datatype="xs:double">440</nennspannung>
                <v_ausw_schaltung nodetype="property" datatype="xs:long">419</v_ausw_schaltung>
                <v_ausw_sternpunkt nodetype="property" datatype="xs:long">458</v_ausw_sternpunkt>
                <stundenziffer nodetype="property" datatype="xs:long">Dyn5</stundenziffer>
                <blitzstossspg_pruef_phase nodetype="property" datatype="xs:long">0</blitzstossspg_pruef_phase>
                <wechselspg_pruef_phase_1000 nodetype="property" datatype="xs:double">3</wechselspg_pruef_phase_1000>
                <zulaessige_erwaermung_1000 nodetype="property" datatype="xs:double">100</zulaessige_erwaermung_1000>
                <TGtExportEDSAuftragStellungenListe nodetype="classlist">
                    <TGtExportEDSAuftragStellung nodetype="class">
                        <spannung nodetype="property" datatype="xs:double">440</spannung>
                    </TGtExportEDSAuftragStellung>
                </TGtExportEDSAuftragStellungenListe>
            </TGtExportEDSAuftragSystem>
        </TGtExportEDSAuftragSystemeListe>
    </TGtExportEDS>
</sgb>`;