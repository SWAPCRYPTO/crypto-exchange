const LOCALE = 'pl-PL'
const CORS_PREFIX = 'https://api.allorigins.win/get?url='
const APIS = [
    {
        name: 'bitbay',
        baseUrl: 'https://bitbay.net/API/Public',
        marketsUrl: 'https://api.bitbay.net/rest/trading/ticker',
        marketsKey: 'items',
        orderBookEndpoint: 'orderbook.json',
        takerFee: 0.00042,
        transferFee: {
            AAVE: 0.1,
            BAT: 10.0,
            BSV: 0.003,
            BTC: 0.0005,
            COMP: 0.042,
            DAI: 27.0,
            DOT: 0.001,
            EOS: 0.1,
            ETH: 0.0006,
            GAME: 196.0,
            GRT: 17.0,
            LINK: 1.65,
            LSK: 0.3,
            LTC: 0.001,
            LUNA: 0.02,
            MANA: 19.0,
            MKR: 0.014,
            NPXS: 17229.0,
            OMG: 6.5,
            PAY: 278.0,
            SRN: 2177.0,
            TRX: 1.0,
            UNI: 0.7,
            USDC: 59.0,
            XLM: 0.005,
            XRP: 0.1,
            XTZ: 0.1,
            ZRX: 16.0,
        },
        urlFormatFunction: (apiUrl: string, marketSymbol: [string, string], endPoint: string) =>
            `${CORS_PREFIX}${apiUrl}/${marketSymbol[0]}${marketSymbol[1]}/${endPoint}`,
    },
    {
        name: 'bittrex',
        baseUrl: 'https://api.bittrex.com/v3/markets',
        marketsUrl: 'https://api.bittrex.com/v3/markets',
        marketsKey: 'symbol',
        orderBookEndpoint: '/orderbook',
        takerFee: 0.00075,
        transferFee: {
            '1INCH': 8.0,
            '1ST': 4.5,
            '4ART': 337.0,
            AAPL: 0.0,
            AAVE: 0.4,
            ABBC: 0.1,
            ABNB: 0.0,
            ABT: 72.0,
            ABYSS: 1177.0,
            ACB: 0.0,
            ACXT: 1.0,
            ADA: 1.0,
            ADABEAR: 12.64,
            ADABULL: 0.004,
            ADK: 0.0,
            ADT: 25591.0,
            ADX: 33.0,
            AEON: 0.1,
            AERGO: 119.0,
            AGRS: 35.0,
            AID: 352.0,
            AKN: 0.1,
            AKRO: 1109.0,
            ALGO: 0.1,
            AMC: 0.0,
            AMD: 0.0,
            AMP: 2192.0,
            AMZN: 0.0,
            ANKR: 247.0,
            ANT: 4.5,
            APHA: 0.0,
            APIX: 40.0,
            APM: 1163.0,
            AR: 1.0,
            ARDR: 2.0,
            ARDX: 1.0,
            ARK: 0.1,
            ARKK: 0.0,
            ART: 1427.0,
            ATOM: 0.004,
            AVAX: 0.001,
            BABA: 0.0,
            BAL: 0.7,
            BAND: 6.0,
            BAT: 15.0,
            BB: 0.0,
            BBC: 0.01,
            BCH: 0.001,
            BCPT: 276.0,
            BEAR: 9.0,
            BEST: 20.0,
            BFT: 868.0,
            BILI: 0.0,
            BITW: 0.0,
            BLK: 0.02,
            BLOC: 21409.0,
            BLOCK: 0.02,
            BLT: 125.0,
            BLTV: 5352.0,
            BNT: 6.0,
            BNTX: 0.0,
            BOA: 104.0,
            BONDLY: 108.0,
            BORA: 177.0,
            BOXX: 275.0,
            BRZ: 230.0,
            BSV: 0.001,
            BTC: 0.0003,
            BTCV: 0.01,
            BTE: 25.0,
            BTM: 0.1,
            BTS: 5.0,
            BTT: 1.0,
            BTU: 58.0,
            BTXCRD: 0.01,
            BULL: 0.0017,
            BURST: 2.0,
            BWF: 2953.0,
            BWX: 591.0,
            BYND: 0.0,
            CAMP: 25591.0,
            CBC: 679.0,
            CEL: 7.0,
            CELO: 0.01,
            CGC: 0.0,
            CGT: 2.0,
            CHR: 188.0,
            CKB: 0.01,
            CLT: 6.0,
            CMCT: 10704.0,
            CND: 2941.0,
            CNS: 0.05,
            CNTM: 116.0,
            COIN: 0.0,
            COMP: 0.05,
            COSM: 1.0,
            CPC: 2258.0,
            CPT: 1.0,
            CRO: 0.01,
            CRON: 0.0,
            CRW: 0.02,
            CTC: 11.0,
            CTXC: 0.01,
            CURE: 0.0002,
            CUSD: 0.01,
            CUT: 137.0,
            CVC: 83.0,
            CVT: 179.0,
            DAI: 42.0,
            DASH: 0.05,
            DAWN: 7.0,
            DCR: 0.01,
            DCT: 0.1,
            DENT: 1881.0,
            DEP: 4516.0,
            DFI: 0.1,
            DGB: 0.2,
            DMT: 36.0,
            DNA: 0.01,
            DNT: 362.0,
            DOGE: 5.0,
            DOT: 0.5,
            DRGN: 154.0,
            DTA: 30.0,
            DUCATO: 1.2,
            DUSK: 161.0,
            ECELL: 783.0,
            ECOC: 0.01,
            EDGELESS: 765.0,
            EDR: 711.0,
            ELA: 0.01,
            ELAMA: 1669.0,
            ELF: 38.0,
            EMC2: 0.2,
            ENG: 250.0,
            ENJ: 16.0,
            EOS: 0.1,
            ETC: 0.01,
            ETH: 0.00073,
            ETHBEAR: 100.0,
            ETHBULL: 0.013,
            EUR: 0.0,
            EXCL: 0.2,
            EXE: 5484.0,
            EXP: 0.01,
            FB: 0.0,
            FCT: 0.01,
            FCT2: 244.0,
            FET: 88.0,
            FIL: 0.04,
            FIRO: 0.1,
            FIT: 8530.0,
            FLETA: 1745.0,
            FLO: 0.2,
            FME: 19193.0,
            FNB: 6398.0,
            FNK: 1.0187,
            FOL: 35.0,
            FOR: 441.0,
            FRSP: 76772.0,
            FSN: 0.006,
            FTC: 0.2,
            FTM: 432.0,
            FUN: 1600.0,
            FX: 67.0,
            GAME: 133.0,
            GBYTE: 0.002,
            GDXJ: 0.0,
            GEO: 0.1,
            GET: 6.0,
            GLD: 0.0,
            GLEEC: 0.1,
            GLM: 97.0,
            GLXY: 0.0,
            GME: 0.0,
            GNC: 0.01,
            GNO: 0.2,
            GNY: 48.0,
            GO: 1.0,
            GOLD: 46.16,
            GOOGL: 0.0,
            GRIN: 0.1,
            GRS: 0.2,
            GRT: 27.0,
            GST: 0.1,
            GTO: 548.0,
            GUP: 2487.0,
            GXC: 0.3,
            HBAR: 0.1,
            HBD: 0.01,
            HDAC: 1.0,
            HDAO: 1872.0,
            HEDG: 28.0,
            HINT: 2666.0,
            HIVE: 0.01,
            HMQ: 4798.0,
            HNS: 0.1,
            HXRO: 70.0,
            HYC: 2288.0,
            HYDRO: 25591.0,
            ICX: 0.02,
            IGNIS: 2.0,
            IHT: 3568.0,
            INCNT: 0.1,
            INSTAR: 0.1,
            INX: 12795.0,
            INXT: 3.0,
            IOC: 0.2,
            ION: 0.2,
            IOST: 1.0,
            IOTA: 0.5,
            IOTX: 893.0,
            IQQ: 334.0,
            IRIS: 0.1,
            ITM: 1.0,
            JNT: 1472.0,
            JOB: 25591.0,
            KAI: 340.0,
            KDA: 0.1,
            KDAG: 65.0,
            KLAY: 0.006,
            KLV: 5.5,
            KMD: 0.002,
            KNC: 14.0,
            KOK: 36.0,
            KRT: 3625.0,
            KSM: 0.1,
            LAMB: 508.0,
            LBA: 357.0,
            LBC: 0.02,
            LCS: 1.0,
            LINK: 1.15,
            LMCH: 7677.0,
            LOOM: 303.0,
            LOON: 972.0,
            LRC: 81.0,
            LSK: 0.1,
            LTC: 0.01,
            LUCY: 0.2,
            LUNA: 0.022,
            MAID: 10.0,
            MANA: 29.0,
            MARO: 0.006,
            MATIC: 50.0,
            MCH: 94.71,
            MCO: 1.7,
            MDT: 662.0,
            ME: 3071.0,
            MED: 10.0,
            MEME: 0.02,
            MER: 0.1,
            MET: 11.0,
            META: 0.006,
            MFA: 2326.0,
            MFT: 2647.0,
            MKR: 0.0095,
            MLN: 0.32,
            MMAON: 533.0,
            MOBI: 1.0,
            MOC: 241.0,
            MOF: 103.0,
            MONA: 0.2,
            MORE: 728.0,
            MRNA: 0.0,
            MRPH: 17.0,
            MSTR: 0.0,
            MTC: 0.0,
            MTL: 11.0,
            MUE: 0.02,
            MYID: 2065.0,
            MYST: 75.0,
            NAV: 0.2,
            NCASH: 6705.0,
            NDAU: 0.1,
            NEO: 0.025,
            NFLX: 0.0,
            NFTX: 1.0,
            NGC: 925.0,
            NIO: 0.0,
            NKN: 64.0,
            NLC2: 0.1,
            NLG: 0.2,
            NMR: 0.65,
            NOK: 0.0,
            NPXS: 10967.0,
            NVDA: 0.0,
            NVT: 0.04,
            NXS: 0.2,
            NXT: 2.0,
            OCEAN: 66.0,
            OCN: 16293.0,
            OGN: 22.0,
            OGO: 571.0,
            OGT: 69.0,
            OK: 0.2,
            OMG: 6.0,
            OMNI: 0.1,
            ONG: 0.1,
            ONT: 1.0,
            ORBS: 329.0,
            OST: 389.0,
            OXEN: 0.2,
            OXT: 68.0,
            PAL: 1.0,
            PANDO: 26.93,
            PART: 0.1,
            PAX: 42.0,
            PAY: 351.0,
            PENN: 0.0,
            PFE: 0.0,
            PHNX: 229.0,
            PI: 1.0,
            PINK: 0.2,
            PIST: 0.45,
            PIVX: 0.02,
            PLA: 38386.0,
            PLG: 21409.0,
            PMA: 76772.0,
            POLY: 170.0,
            POT: 0.002,
            POWR: 106.0,
            PPC: 0.02,
            PRO: 49.0,
            PROM: 4.5,
            PROS: 1.55,
            PTON: 76772.0,
            PTOY: 1200.0,
            PXL: 1.0,
            PYPL: 0.0,
            QCX: 651.0,
            QLC: 0.0,
            QNT: 1.05,
            QRL: 0.1,
            QTUM: 0.01,
            RCN: 360.0,
            RDD: 2.0,
            REN: 49.0,
            RENBTC: 0.0008,
            REPV2: 1.6,
            REV: 4697.0,
            REVV: 158.0,
            RFOX: 154.0,
            RFR: 5352.0,
            RGT: 1.0,
            RLC: 14.0,
            ROOM: 29.0,
            RSR: 499.0,
            RSV: 1.0,
            RVC: 1.0,
            RVN: 1.0,
            SAND: 166.0,
            SBD: 0.01,
            SBT: 7520.0,
            SC: 0.1,
            SDT: 2.2,
            SENSO: 25.0,
            SG: 0.7614,
            SHR: 1662.0,
            SIB: 0.2,
            SIG: 1.0,
            SIX: 0.1,
            SKM: 6979.0,
            SLICE: 37.0,
            SLS: 0.002,
            SLV: 0.0,
            SMARTCREDIT: 2.8,
            SMBSWAP: 53.0,
            SNT: 628.0,
            SNX: 5.0,
            SOLVE: 473.0,
            SPC: 624.0,
            SPHR: 0.1,
            SPI: 0.35,
            SPIN: 10.0,
            SPND: 461.0,
            SPY: 0.0,
            SQ: 0.0,
            SRN: 1567.0,
            STC: 465.0,
            STEEM: 0.01,
            STMX: 808.0,
            STORJ: 21.0,
            STPT: 533.0,
            STRAX: 0.01,
            STRK: 0.65,
            SUKU: 62.0,
            SUSD: 8.0,
            SUTER: 969.0,
            SWT: 160.0,
            SXP: 10.0,
            SYLO: 2152.0,
            SYS: 0.0002,
            TEA: 143.0,
            TEMCO: 10.0,
            TFC: 0.1,
            THC: 1.0,
            TNC: 0.0,
            TRAC: 72.0,
            TRIO: 8888.0,
            TRX: 0.003,
            TRYB: 346.0,
            TSHP: 1706.0,
            TSLA: 0.0,
            TSM: 0.0,
            TUBE: 0.01,
            TUDA: 3338.0,
            TUSD: 42.0,
            TWTR: 0.0,
            UBER: 0.0,
            UBQ: 0.01,
            UBT: 63.0,
            UCT: 5906.0,
            UMA: 4.0,
            UNI: 1.0,
            UPCO2: 4.5,
            UPEUR: 43.0,
            UPP: 296.0,
            UPT: 6398.0,
            UPUSD: 44.0,
            UPXAU: 0.0233,
            UQC: 1.55,
            URAC: 25591.0,
            URQA: 21.0,
            USD: 0.0,
            USDC: 42.0,
            USDN: 0.1,
            USDS: 40.0,
            USDT: 10.0,
            USO: 0.0,
            UST: 3.08,
            UTI: 19193.0,
            UTK: 84.0,
            VAL: 0.2,
            VANY: 19193.0,
            VBK: 0.05,
            VDX: 28923.0,
            VEE: 6398.0,
            VET: 100.0,
            VIA: 0.2,
            VIB: 327.0,
            VID: 100.0,
            VIL: 1.7,
            VITE: 256.0,
            VLX: 0.01,
            VRA: 1024.0,
            VRC: 0.0002,
            VTC: 0.02,
            WAVES: 0.001,
            WAXP: 0.1,
            WBTC: 0.0008,
            WGP: 3338.0,
            WIB: 1.0,
            WICC: 0.01,
            WINGS: 415.0,
            WXBTC: 8.0,
            XDB: 173.0,
            XDN: 0.02,
            XEL: 0.2,
            XELS: 7.0,
            XEM: 4.0,
            XHV: 0.01,
            XLM: 0.05,
            XMR: 0.0001,
            XMY: 0.2,
            XNK: 2666.0,
            XRP: 1.0,
            XSR: 823.0,
            XST: 0.02,
            XTP: 7677.0,
            XTZ: 0.25,
            XUC: 93.0,
            XVG: 5.0,
            XWC: 0.01,
            XYM: 1.0,
            XYO: 12480.0,
            YFL: 0.15,
            YOU: 495.0,
            ZEC: 0.01,
            ZEN: 0.002,
            ZIL: 0.002,
            ZM: 0.0,
            ZRX: 25.0,
            ZUSD: 12.0,
        },
        urlFormatFunction: (apiUrl: string, marketSymbol: [string, string], endPoint: string) =>
            `${CORS_PREFIX}${apiUrl}/${marketSymbol[0]}-${marketSymbol[1]}/${endPoint}`,
    },
]

export { LOCALE, CORS_PREFIX, APIS }
