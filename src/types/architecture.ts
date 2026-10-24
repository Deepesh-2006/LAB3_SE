export type LayerType = 'presentation' | 'business' | 'data';

export interface UMLInterface {
  id: string;
  name: string;
  type: 'provided' | 'required';
  sourceComponentId: string;
  targetComponentId: string;
  protocol: string;
  description: string;
  methods: string[];
  dataPayloadExample?: string;
  labelPosition?: { x: number; y: number };
}

export interface UMLComponent {
  id: string;
  name: string;
  layer: LayerType;
  stereotype: string;
  description: string;
  responsibilities: string[];
  providedInterfaces: string[];
  requiredInterfaces: string[];
  securityNote: string;
  performanceNote: string;
  hardwareInteraction?: string;
  // Canvas layout coordinates
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CoffeeItem {
  id: 'espresso' | 'americano' | 'latte';
  name: string;
  description: string;
  basePrice: number;
  imageEmoji: string;
  caffeine: string;
}

export type DrinkSize = 'Small' | 'Large';

export interface OrderState {
  item: CoffeeItem | null;
  size: DrinkSize;
  orderNumber: number;
  total: number;
  timestamp: string;
  cardLast4: string;
  authCode: string;
}

export type SimulationStep = 
  | 'idle'
  | 'fetch_menu'
  | 'select_item'
  | 'process_payment'
  | 'payment_approved'
  | 'record_order'
  | 'print_receipt'
  | 'order_complete';
