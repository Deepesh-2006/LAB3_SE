import { UMLComponent, UMLInterface, CoffeeItem } from '../types/architecture';

export const COFFEE_MENU: CoffeeItem[] = [
  {
    id: 'espresso',
    name: 'Espresso',
    description: 'Rich, concentrated single origin dark roast with crema',
    basePrice: 3.50,
    imageEmoji: '☕',
    caffeine: '65mg'
  },
  {
    id: 'americano',
    name: 'Americano',
    description: 'Fresh espresso diluted with filtered hot water',
    basePrice: 4.00,
    imageEmoji: '☕',
    caffeine: '95mg'
  },
  {
    id: 'latte',
    name: 'Latte',
    description: 'Smooth espresso layered with steamed whole milk & light foam',
    basePrice: 4.75,
    imageEmoji: '🥛',
    caffeine: '75mg'
  }
];

export const SIZE_PRICES: Record<'Small' | 'Large', number> = {
  Small: 0,
  Large: 1.00
};

export const UML_COMPONENTS: UMLComponent[] = [
  {
    id: 'touchscreen_ui',
    name: 'Touchscreen UI Component',
    layer: 'presentation',
    stereotype: '<<component>>',
    description: 'Customer-facing touch interface handling menu rendering, item/size selection, visual order summary, and payment prompts.',
    responsibilities: [
      'Render catalog items, coffee sizes, and real-time total pricing',
      'Capture touch interactions and validate user selections',
      'Display card insertion/tap prompts and payment transaction status',
      'Render order confirmation feedback and receipt printing animation'
    ],
    providedInterfaces: ['IUIEventHandler'],
    requiredInterfaces: ['IOrderPlacement', 'IMenuCatalog'],
    securityNote: 'Client-side presentation strictly sanitizes user input and has NO direct access to printer serial ports or database files.',
    performanceNote: 'Local UI caching provides instantaneous 60 FPS transitions without waiting on network queries during drink selection.',
    hardwareInteraction: 'Touchscreen Display Driver (Capacitive Touch Input / HDMI / DSI)',
    x: 420,
    y: 70,
    width: 260,
    height: 120
  },
  {
    id: 'order_manager',
    name: 'Order Manager Component',
    layer: 'business',
    stereotype: '<<component>>',
    description: 'Central orchestration engine coordinating order state machine, cart calculation, payment verification, and receipt generation.',
    responsibilities: [
      'Manage order lifecycle (CREATED -> PRICED -> PAID -> PRINTED -> COMPLETED)',
      'Calculate subtotal, tax, and size adjustments for selected coffee',
      'Trigger payment authorization requests to Payment Service Component',
      'Format receipt payload and trigger Receipt Printer Component',
      'Persist finalized transaction records into Database Component'
    ],
    providedInterfaces: ['IOrderPlacement'],
    requiredInterfaces: ['IPaymentProcessing', 'IReceiptPrint', 'IMenuCatalog', 'IDataStore'],
    securityNote: 'Central gatekeeper enforcing state invariants: orders cannot print or record until cryptographically confirmed paid.',
    performanceNote: 'Asynchronous event dispatching ensures slow mechanical printing does not block the UI from resetting for the next customer.',
    x: 420,
    y: 280,
    width: 260,
    height: 130
  },
  {
    id: 'payment_service',
    name: 'Payment Service Component',
    layer: 'business',
    stereotype: '<<component>>',
    description: 'Isolated payment processor handling secure credit card authorization, EMV reader communication, and tokenized receipts.',
    responsibilities: [
      'Communicate with physical EMV Chip/Contactless card reader terminal',
      'Enforce PCI-DSS tokenization; card numbers never stored in plaintext',
      'Execute cryptographic transaction requests and process approval/decline codes',
      'Generate masked authorization slips and unique payment reference tokens'
    ],
    providedInterfaces: ['IPaymentProcessing'],
    requiredInterfaces: ['ICardReaderHardware'],
    securityNote: 'Critical isolation barrier: Sensitive cardholder data is contained strictly within EMV hardware boundaries with zero kiosk database leakage.',
    performanceNote: 'Uses optimized timeout protocols (max 3.5s) with keep-alive connections to banking switch for speedy cafe queues.',
    hardwareInteraction: 'EMV Credit Card Terminal / Pinpad Hardware',
    x: 100,
    y: 280,
    width: 250,
    height: 130
  },
  {
    id: 'receipt_printer',
    name: 'Receipt Printer Component',
    layer: 'business',
    stereotype: '<<component>>',
    description: 'Hardware abstraction bridge communicating with thermal receipt printer, managing print queues, paper out status, and ESC/POS commands.',
    responsibilities: [
      'Format receipt layout with café branding, item details, timestamp, and card auth',
      'Translate formatted receipt into ESC/POS thermal printer byte commands',
      'Manage non-blocking print spooling queue to prevent device bottlenecks',
      'Monitor hardware telemetry (paper low, cover open, print head temperature)'
    ],
    providedInterfaces: ['IReceiptPrint'],
    requiredInterfaces: ['IPrinterHardwareDriver'],
    securityNote: 'Masks cardholder information on physical printouts (displays only last 4 digits) to comply with financial privacy laws.',
    performanceNote: 'Spools print jobs asynchronously so customer can take receipt while kiosk immediately pre-loads home screen for next patron.',
    hardwareInteraction: 'ESC/POS Thermal Receipt Printer (USB / RS-232 Serial Port)',
    x: 750,
    y: 280,
    width: 250,
    height: 130
  },
  {
    id: 'database',
    name: 'Database Component',
    layer: 'data',
    stereotype: '<<component>>',
    description: 'Local persistent data store housing coffee catalog, pricing rules, size multipliers, and historical transaction audit logs.',
    responsibilities: [
      'Store static and dynamic coffee menu items (Espresso, Americano, Latte)',
      'Maintain drink size pricing tables (Small, Large)',
      'Persist completed order records, totals, timestamps, and payment reference tokens',
      'Provide fast indexed query capabilities for kiosk startup and reporting'
    ],
    providedInterfaces: ['IMenuCatalog', 'IDataStore'],
    requiredInterfaces: [],
    securityNote: 'Encrypted at rest using AES-256 SQLite database file; financial audit log entries are write-once / append-only.',
    performanceNote: 'Read-heavy in-memory caching keeps menu retrieval latency under 1 millisecond.',
    hardwareInteraction: 'Local Solid State Storage (SSD / Flash NVMe)',
    x: 420,
    y: 510,
    width: 260,
    height: 120
  }
];

export const UML_INTERFACES: UMLInterface[] = [
  {
    id: 'if_order_placement',
    name: 'IOrderPlacement',
    type: 'provided',
    sourceComponentId: 'order_manager',
    targetComponentId: 'touchscreen_ui',
    protocol: 'In-Process Event Call / IPC',
    description: 'Allows Presentation Layer to submit selected coffee, size, request pricing calculation, and subscribe to order status updates.',
    methods: [
      'createOrder(drinkType: string, size: string): OrderSummary',
      'confirmOrder(orderId: string): boolean',
      'cancelCurrentOrder(): void'
    ],
    dataPayloadExample: '{ orderId: "ORD-9082", coffee: "Latte", size: "Large", subtotal: 5.75, tax: 0.46, total: 6.21 }'
  },
  {
    id: 'if_payment_processing',
    name: 'IPaymentProcessing',
    type: 'provided',
    sourceComponentId: 'payment_service',
    targetComponentId: 'order_manager',
    protocol: 'Encrypted Local RPC / API Call',
    description: 'Allows Order Manager to request credit card authorization, verify funds, and obtain masked transaction receipt tokens.',
    methods: [
      'initiateCardPayment(amount: number, orderId: string): PaymentPromise',
      'cancelPaymentTransaction(txId: string): void',
      'verifyTerminalStatus(): TerminalHealth'
    ],
    dataPayloadExample: '{ txId: "TX-44810", status: "APPROVED", cardType: "VISA", last4: "8821", authCode: "AUTH-77391" }'
  },
  {
    id: 'if_receipt_print',
    name: 'IReceiptPrint',
    type: 'provided',
    sourceComponentId: 'receipt_printer',
    targetComponentId: 'order_manager',
    protocol: 'Hardware Bridge / ESC/POS Stream',
    description: 'Allows Order Manager to dispatch formatted receipt content to the thermal printer hardware spooler.',
    methods: [
      'printReceipt(receiptData: ReceiptPayload): PrintStatus',
      'checkPrinterReady(): boolean',
      'feedAndCutPaper(): void'
    ],
    dataPayloadExample: '{ store: "Café Kiosk #01", orderId: "ORD-9082", items: ["Latte (Large) $5.75"], card: "VISA **** 8821", status: "SUCCESS" }'
  },
  {
    id: 'if_menu_catalog',
    name: 'IMenuCatalog',
    type: 'provided',
    sourceComponentId: 'database',
    targetComponentId: 'order_manager',
    protocol: 'SQL Query / Data Access Object',
    description: 'Provides query access to available coffee types, size modifiers, active prices, and tax rates.',
    methods: [
      'getAvailableMenu(): MenuItem[]',
      'getItemPrice(itemId: string, size: string): number',
      'getTaxRates(): TaxConfig'
    ],
    dataPayloadExample: '[ { id: "esp", name: "Espresso", basePrice: 3.50 }, { id: "lat", name: "Latte", basePrice: 4.75 } ]'
  },
  {
    id: 'if_data_store',
    name: 'IDataStore',
    type: 'provided',
    sourceComponentId: 'database',
    targetComponentId: 'order_manager',
    protocol: 'ACID Transactional SQL Insert',
    description: 'Persists completed order transactions, timestamped audit events, and sales summary records.',
    methods: [
      'saveCompletedOrder(record: OrderTransactionRecord): boolean',
      'logAuditTrail(event: AuditEvent): void'
    ],
    dataPayloadExample: '{ orderNumber: 104, timestamp: "2026-10-24T10:45:00Z", total: 5.75, paymentRef: "TX-44810" }'
  }
];

export const ARCHITECTURE_COMPARISON = [
  {
    style: 'Layered Architecture (Selected)',
    pros: [
      'Strict separation of concerns (Presentation, Business, Data layers)',
      'Ideal for standalone dedicated kiosk hardware with zero network dependency',
      'Hardware drivers (Printer, Card Reader) neatly isolated behind business services',
      'Easy to test, debug, and maintain in a commercial embedded system'
    ],
    cons: [
      'Tight coupling between adjacent layers if interfaces are not strictly abstracted',
      'Cannot scale individual layers across different machines (unnecessary for a single kiosk)'
    ],
    suitability: 'High (Best Match for Kiosk Scenario)',
    verdict: 'Recommended: Simple, robust, self-contained, and perfectly handles local hardware & fast touch UI.'
  },
  {
    style: 'Microservices Architecture',
    pros: [
      'Independent deployment and scaling per service',
      'Fault isolation between micro-components',
      'Polyglot technology stack option'
    ],
    cons: [
      'Extreme operational overhead for a single cafe kiosk machine',
      'Inter-service network latency slows down customer ordering queue',
      'Requires container orchestrator (Docker/K8s) or complex service discovery',
      'Distributed transaction complexity (Saga patterns) for simple coffee payment'
    ],
    suitability: 'Low (Severe Over-Engineering)',
    verdict: 'Not recommended: Over-engineered for an edge touch terminal; introduces unnecessary network latency and failure points.'
  },
  {
    style: 'Client-Server Architecture',
    pros: [
      'Centralized server manages menu pricing across multiple café branches',
      'Centralized reporting and database administration',
      'Thin client on kiosk hardware'
    ],
    cons: [
      'Single point of failure: if café Wi-Fi / server drops, kiosks stop selling coffee',
      'Network latency directly degrades touchscreen responsiveness',
      'Hardware peripherals (receipt printer, card reader) must still be managed locally'
    ],
    suitability: 'Medium',
    verdict: 'Viable for chain synchronization, but inferior to Layered Architecture for local terminal resilience and offline kiosk autonomy.'
  }
];

export const WRITTEN_JUSTIFICATION_DOC = {
  title: 'Lab 3: Architectural Justification Document',
  course: 'Software Engineering - Architecture & Component Modelling',
  scenario: 'Self-Service Coffee Kiosk System',
  mandatorySelectionStatement: 'We chose Layered Architecture for the Self-Service Coffee Kiosk System.',
  architecturalChoice: 'Layered Architecture (3-Tier: Presentation Layer, Business Logic Layer, Data & Persistence Layer)',
  twoReasons: [
    {
      title: 'Reason 1: Hardware Abstraction & Peripheral Isolation in a Standalone Edge Terminal',
      description: 'The coffee kiosk is a physical self-service kiosk situated on-premise in a busy cafe, requiring tight coupling to physical peripherals (a touchscreen display, an EMV credit card reader, and an ESC/POS thermal receipt printer). Layered architecture isolates touch-interaction logic in the Presentation Layer, while isolating hardware-specific device drivers (Receipt Printer Component and Payment Service Component) inside dedicated service wrappers in the Business Layer. If the café upgrades its thermal printer or swaps card readers, only the hardware driver interface requires adaptation without modifying the core ordering logic or user interface.'
    },
    {
      title: 'Reason 2: High Operational Reliability & Zero Network Dependency in High-Volume Queues',
      description: 'In a bustling café environment, long lines demand rapid throughput and absolute reliability. Unlike distributed microservices which introduce inter-process network overhead, serialization latency, and network timeout vulnerabilities, a Layered Architecture executes in-process on the local kiosk computer. Menu data and pricing calculations resolve instantaneously within memory, allowing the kiosk to continue serving coffee even during intermittent café broadband or Wi-Fi disruptions.'
    }
  ],
  securityAdvantage: {
    title: 'Security Advantage: Strict PCI-DSS Isolation & Sandboxed Financial Boundary',
    description: 'By enforcing horizontal layer separation, customer payment handling is strictly segregated. The customer interacts only with the Presentation Layer, which never receives or handles raw credit card primary account numbers (PAN). Instead, payment requests are routed through the Payment Service Component directly to the secure hardware EMV chip terminal. The Presentation Layer and local Database Component have zero direct access to financial credentials. Order confirmation requires a signed token before triggering the Order Manager and Receipt Printer, completely preventing unauthorized receipt forgery or payment bypass.'
  },
  performanceBenefit: {
    title: 'Performance Benefit: Sub-Millisecond Menu Queries & Asynchronous Print Spooling',
    description: 'Layered Architecture enables high-performance local data caching and asynchronous task decoupling. Menu catalog data (coffee types: Espresso, Americano, Latte; and size multipliers) is loaded into an in-memory cache in the Data Layer, eliminating database I/O lag and enabling 60 FPS touchscreen response times. Furthermore, the Order Manager decouples the slow mechanical printing process by spooling print commands asynchronously to the Receipt Printer Component. The UI immediately resets to welcome the next patron in line while the physical printer finishes emitting the receipt.'
  },
  componentsSummary: [
    {
      name: 'Touchscreen UI Component',
      layer: 'Presentation Layer',
      provided: 'IUIEventHandler',
      required: 'IOrderPlacement, IMenuCatalog',
      role: 'Renders intuitive touch screen menu, captures drink choices (Espresso/Americano/Latte) & sizes (Small/Large), and displays transaction status.'
    },
    {
      name: 'Order Manager Component',
      layer: 'Business Logic Layer',
      provided: 'IOrderPlacement',
      required: 'IPaymentProcessing, IReceiptPrint, IMenuCatalog, IDataStore',
      role: 'Orchestrates the order state machine, calculates prices and taxes, verifies payment approval, triggers receipt printing, and persists orders.'
    },
    {
      name: 'Payment Service Component',
      layer: 'Business Logic Layer',
      provided: 'IPaymentProcessing',
      required: 'ICardReaderHardware',
      role: 'Handles credit card only transactions, interfaces with secure EMV card reader hardware, returns approval tokens, and enforces PCI security.'
    },
    {
      name: 'Receipt Printer Component',
      layer: 'Business / Hardware Layer',
      provided: 'IReceiptPrint',
      required: 'IPrinterHardwareDriver',
      role: 'Formats ESC/POS receipts with item details, masked payment token, and timestamp, spooling print jobs to physical thermal hardware.'
    },
    {
      name: 'Database Component',
      layer: 'Data / Persistence Layer',
      provided: 'IMenuCatalog, IDataStore',
      required: 'None (Base Data Layer)',
      role: 'Stores coffee drink catalog, size pricing multipliers, and historical transaction logs for sales auditing.'
    }
  ]
};

// Generates valid draw.io XML that students can download and import directly into diagrams.net
export function generateDrawIOXML(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2026-10-24T00:00:00.000Z" agent="AI Studio" version="24.0.0" type="device">
  <diagram id="lab3-coffee-kiosk" name="Coffee Kiosk Component Diagram">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        
        <!-- Presentation Layer Container -->
        <mxCell id="layer_pres" value="Presentation Layer" style="swimlane;startSize=26;dashed=1;strokeColor=#3b82f6;fillColor=#eff6ff;fontStyle=1;align=left;spacingLeft=10;fontColor=#1e3a8a;" vertex="1" parent="1">
          <mxGeometry x="60" y="40" width="980" height="170" as="geometry" />
        </mxCell>
        
        <!-- Touchscreen UI Component -->
        <mxCell id="cmp_ui" value="&lt;&lt;component&gt;&gt;&#xa;&lt;b&gt;Touchscreen UI Component&lt;/b&gt;" style="html=1;dropTarget=0;whiteSpace=wrap;fillColor=#dbeafe;strokeColor=#2563eb;fontColor=#1e3a8a;shape=module;align=center;" vertex="1" parent="layer_pres">
          <mxGeometry x="360" y="45" width="260" height="90" as="geometry" />
        </mxCell>
        
        <!-- Business Layer Container -->
        <mxCell id="layer_biz" value="Business Logic Layer" style="swimlane;startSize=26;dashed=1;strokeColor=#10b981;fillColor=#f0fdf4;fontStyle=1;align=left;spacingLeft=10;fontColor=#065f46;" vertex="1" parent="1">
          <mxGeometry x="60" y="240" width="980" height="230" as="geometry" />
        </mxCell>
        
        <!-- Payment Service Component -->
        <mxCell id="cmp_pay" value="&lt;&lt;component&gt;&gt;&#xa;&lt;b&gt;Payment Service Component&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#64748b&quot;&gt;[Credit Card Only]&lt;/font&gt;" style="html=1;dropTarget=0;whiteSpace=wrap;fillColor=#fef3c7;strokeColor=#d97706;fontColor=#92400e;shape=module;align=center;" vertex="1" parent="layer_biz">
          <mxGeometry x="40" y="60" width="240" height="90" as="geometry" />
        </mxCell>
        
        <!-- Order Manager Component -->
        <mxCell id="cmp_order" value="&lt;&lt;component&gt;&gt;&#xa;&lt;b&gt;Order Manager Component&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#64748b&quot;&gt;[Orchestrator]&lt;/font&gt;" style="html=1;dropTarget=0;whiteSpace=wrap;fillColor=#d1fae5;strokeColor=#059669;fontColor=#065f46;shape=module;align=center;" vertex="1" parent="layer_biz">
          <mxGeometry x="360" y="60" width="260" height="90" as="geometry" />
        </mxCell>
        
        <!-- Receipt Printer Component -->
        <mxCell id="cmp_print" value="&lt;&lt;component&gt;&gt;&#xa;&lt;b&gt;Receipt Printer Component&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#64748b&quot;&gt;[Hardware Driver]&lt;/font&gt;" style="html=1;dropTarget=0;whiteSpace=wrap;fillColor=#f3e8ff;strokeColor=#9333ea;fontColor=#581c87;shape=module;align=center;" vertex="1" parent="layer_biz">
          <mxGeometry x="700" y="60" width="240" height="90" as="geometry" />
        </mxCell>
        
        <!-- Data Layer Container -->
        <mxCell id="layer_data" value="Data Layer" style="swimlane;startSize=26;dashed=1;strokeColor=#f59e0b;fillColor=#fffbeb;fontStyle=1;align=left;spacingLeft=10;fontColor=#92400e;" vertex="1" parent="1">
          <mxGeometry x="60" y="500" width="980" height="180" as="geometry" />
        </mxCell>
        
        <!-- Database Component -->
        <mxCell id="cmp_db" value="&lt;&lt;component&gt;&gt;&#xa;&lt;b&gt;Database Component&lt;/b&gt;&#xa;&lt;font size=&quot;1&quot; color=&quot;#64748b&quot;&gt;[Menu &amp; Pricing Catalog / Order Log]&lt;/font&gt;" style="html=1;dropTarget=0;whiteSpace=wrap;fillColor=#fef3c7;strokeColor=#b45309;fontColor=#78350f;shape=module;align=center;" vertex="1" parent="layer_data">
          <mxGeometry x="360" y="45" width="260" height="90" as="geometry" />
        </mxCell>
        
        <!-- Connectors & Interfaces -->
        <!-- UI to Order Manager (IOrderPlacement) -->
        <mxCell id="edge_ui_order" value="IOrderPlacement" style="endArrow=oval;dashed=0;html=1;strokeWidth=2;startArrow=none;endFill=1;strokeColor=#2563eb;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="cmp_ui" target="cmp_order">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        
        <!-- Order Manager to Payment Service (IPaymentProcessing) -->
        <mxCell id="edge_order_pay" value="IPaymentProcessing" style="endArrow=oval;dashed=0;html=1;strokeWidth=2;startArrow=none;endFill=1;strokeColor=#d97706;exitX=0;exitY=0.5;entryX=1;entryY=0.5;" edge="1" parent="1" source="cmp_order" target="cmp_pay">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        
        <!-- Order Manager to Receipt Printer (IReceiptPrint) -->
        <mxCell id="edge_order_print" value="IReceiptPrint" style="endArrow=oval;dashed=0;html=1;strokeWidth=2;startArrow=none;endFill=1;strokeColor=#9333ea;exitX=1;exitY=0.5;entryX=0;entryY=0.5;" edge="1" parent="1" source="cmp_order" target="cmp_print">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        
        <!-- Order Manager to Database (IMenuCatalog / IDataStore) -->
        <mxCell id="edge_order_db" value="IMenuCatalog &amp; IDataStore" style="endArrow=oval;dashed=0;html=1;strokeWidth=2;startArrow=none;endFill=1;strokeColor=#b45309;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="cmp_order" target="cmp_db">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
}
