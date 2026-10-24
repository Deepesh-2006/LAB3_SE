import React, { useState } from 'react';
import { COFFEE_MENU, SIZE_PRICES } from '../data/labData';
import { CoffeeItem, DrinkSize, OrderState, SimulationStep } from '../types/architecture';
import { Coffee, CreditCard, Printer, CheckCircle2, RotateCcw, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface KioskSimulatorProps {
  simulationStep: SimulationStep;
  setSimulationStep: (step: SimulationStep) => void;
  onComponentFocus?: (compId: string) => void;
}

export const KioskSimulator: React.FC<KioskSimulatorProps> = ({
  simulationStep,
  setSimulationStep,
  onComponentFocus
}) => {
  const [selectedItem, setSelectedItem] = useState<CoffeeItem>(COFFEE_MENU[0]);
  const [selectedSize, setSelectedSize] = useState<DrinkSize>('Large');
  const [orderNumber, setOrderNumber] = useState<number>(104);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'kiosk' | 'flow'>('kiosk');

  const subtotal = selectedItem.basePrice + SIZE_PRICES[selectedSize];
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  const currentOrder: OrderState = {
    item: selectedItem,
    size: selectedSize,
    orderNumber,
    total: grandTotal,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    cardLast4: '4242',
    authCode: 'AP-99201'
  };

  const handleSelectCoffee = (item: CoffeeItem) => {
    setSelectedItem(item);
    setSimulationStep('select_item');
    if (onComponentFocus) onComponentFocus('touchscreen_ui');
  };

  const handleSelectSize = (size: DrinkSize) => {
    setSelectedSize(size);
    setSimulationStep('select_item');
    if (onComponentFocus) onComponentFocus('touchscreen_ui');
  };

  const handlePay = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    // Step 1: Touchscreen UI submits order to Order Manager
    setSimulationStep('process_payment');
    if (onComponentFocus) onComponentFocus('payment_service');

    setTimeout(() => {
      // Step 2: Payment Approved by Payment Service Component
      setSimulationStep('payment_approved');
      
      setTimeout(() => {
        // Step 3: Record transaction in Database Component
        setSimulationStep('record_order');
        if (onComponentFocus) onComponentFocus('database');

        setTimeout(() => {
          // Step 4: Dispatch to Receipt Printer Component
          setSimulationStep('print_receipt');
          if (onComponentFocus) onComponentFocus('receipt_printer');

          setTimeout(() => {
            // Step 5: Order complete & paper ejected
            setSimulationStep('order_complete');
            setIsProcessing(false);
            setOrderNumber(prev => prev + 1);
          }, 1400);
        }, 900);
      }, 900);
    }, 1100);
  };

  const handleReset = () => {
    setIsProcessing(false);
    setSimulationStep('idle');
    if (onComponentFocus) onComponentFocus('touchscreen_ui');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Header bar */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/30">
            ☕
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Self-Service Coffee Kiosk Simulator
            </h3>
            <p className="text-[11px] text-slate-400">
              Lab Scenario Verification: 3 Coffees • 2 Sizes • Card Payment • Receipt Print
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('kiosk')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeTab === 'kiosk' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Touch Kiosk
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeTab === 'flow' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            UML Trace Flow
          </button>
        </div>
      </div>

      {activeTab === 'kiosk' ? (
        <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left: Interactive Touchscreen Terminal Screen */}
          <div className="md:col-span-7 bg-slate-950 border-2 border-slate-700 rounded-xl p-4 flex flex-col justify-between shadow-inner relative overflow-hidden">
            {/* Screen shine reflection */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rotate-45 pointer-events-none rounded-full blur-xl"></div>

            {/* Screen Header */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  KIOSK #01 • TOUCH INTERFACE
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Order #{orderNumber}
                </span>
              </div>

              {/* Requirement 1: 3 Coffee types selection */}
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                1. Select Coffee (3 Types)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {COFFEE_MENU.map(item => {
                  const isSelected = selectedItem.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectCoffee(item)}
                      disabled={isProcessing}
                      className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <div>
                        <div className="text-2xl mb-1">{item.imageEmoji}</div>
                        <div className="font-bold text-xs text-white leading-tight">{item.name}</div>
                        <div className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                          {item.description}
                        </div>
                      </div>
                      <div className="mt-2 font-mono font-bold text-amber-400 text-xs">
                        ${item.basePrice.toFixed(2)}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Requirement 2: 2 Drink sizes selection */}
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                2. Select Size (2 Options)
              </label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {(['Small', 'Large'] as DrinkSize[]).map(size => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => handleSelectSize(size)}
                      disabled={isProcessing}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-white">{size}</div>
                        <div className="text-[10px] text-slate-400">
                          {size === 'Small' ? '12 oz Standard' : '16 oz Extra Shot'}
                        </div>
                      </div>
                      <div className="font-mono text-xs font-semibold text-blue-400">
                        {size === 'Small' ? 'Included' : '+$1.00'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Requirement 3: Credit card payment prompt & action */}
            <div className="border-t border-slate-800 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Subtotal</span>
                <span className="font-mono text-xs text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Tax (8%)</span>
                <span className="font-mono text-xs text-slate-200">${tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-3 text-sm font-bold">
                <span className="text-white">Total Amount</span>
                <span className="font-mono text-emerald-400 text-base font-extrabold">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              {simulationStep === 'order_complete' ? (
                <div className="space-y-2">
                  <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Transaction approved &amp; printed! Please collect receipt below.</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Start Next Customer Order
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg ${
                    isProcessing
                      ? 'bg-amber-600 text-amber-100 cursor-wait'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  {isProcessing ? 'Authorizing Card & Printing...' : 'Pay with Credit Card Only'}
                </button>
              )}
            </div>
          </div>

          {/* Right: Hardware Emulators (Card Terminal & Thermal Printer) */}
          <div className="md:col-span-5 flex flex-col justify-between gap-3">
            {/* 1. EMV Card Reader Terminal */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <CreditCard className="w-3.5 h-3.5" />
                  EMV POS Hardware Bridge
                </div>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20">
                  PCI-DSS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Hardware terminal connected via Payment Service Component.
              </p>
              <div className="bg-slate-900 rounded-lg p-2 font-mono text-[11px] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Card: VISA **** 4242</span>
                <span className={simulationStep === 'process_payment' ? 'text-amber-400 animate-pulse font-bold' : 'text-emerald-400'}>
                  {simulationStep === 'process_payment' ? 'HOLD CARD...' : 'TERMINAL READY'}
                </span>
              </div>
            </div>

            {/* 2. Requirement 4: Thermal Receipt Printer Hardware */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex-1 flex flex-col justify-between text-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                    <Printer className="w-3.5 h-3.5" />
                    Thermal Receipt Printer
                  </div>
                  <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20">
                    ESC/POS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  ESC/POS thermal printer slot emitting printed order slip.
                </p>
              </div>

              {/* Physical Receipt Paper Animation */}
              <div className="relative bg-slate-900 rounded-lg border border-slate-800 p-2 min-h-[140px] flex items-center justify-center overflow-hidden">
                {simulationStep === 'print_receipt' || simulationStep === 'order_complete' ? (
                  <div className="w-full bg-white text-slate-900 p-3 rounded font-mono text-[10px] shadow-2xl animate-in slide-in-from-top-6 duration-700 border-b-2 border-dashed border-slate-400">
                    <div className="text-center font-bold text-xs border-b pb-1 mb-1 border-slate-300">
                      ☕ CAFÉ EXPRESS KIOSK
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-600 mb-1">
                      <span>Order #{currentOrder.orderNumber}</span>
                      <span>{currentOrder.timestamp}</span>
                    </div>
                    <div className="border-t border-b border-slate-200 py-1 my-1">
                      <div className="flex justify-between font-bold">
                        <span>1x {currentOrder.item?.name} ({currentOrder.size})</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-600">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-300">
                      <span>TOTAL PAID</span>
                      <span>${currentOrder.total.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 text-center text-[8px] text-slate-500 uppercase tracking-widest border-t border-slate-200 pt-1">
                      PAID: CREDIT CARD (AUTH: {currentOrder.authCode})
                      <br />THANK YOU FOR VISITING!
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 text-[11px] flex flex-col items-center gap-1.5">
                    <div className="w-16 h-1 bg-slate-800 rounded"></div>
                    <span>Printer Spooler Idle (Awaiting Payment Approval)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* UML Trace Flow tab */
        <div className="p-4 bg-slate-950 text-xs">
          <div className="text-slate-300 font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Execution Trace: How this action executes through the 5 Components
          </div>
          <div className="space-y-2">
            <div className={`p-2.5 rounded-lg border ${simulationStep === 'fetch_menu' || simulationStep === 'select_item' ? 'bg-blue-950/60 border-blue-500' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Touchscreen UI Component ➔ Order Manager Component</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-7">
                User selects {selectedItem.name} ({selectedSize}). The UI component calls <code className="text-blue-300 font-mono">IOrderPlacement.createOrder()</code>.
              </p>
            </div>

            <div className={`p-2.5 rounded-lg border ${simulationStep === 'process_payment' ? 'bg-amber-950/60 border-amber-500' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Order Manager Component ➔ Payment Service Component</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-7">
                Order Manager invokes <code className="text-amber-300 font-mono">IPaymentProcessing.initiateCardPayment(${grandTotal.toFixed(2)})</code> over local RPC. The EMV hardware encrypts and authorizes card details.
              </p>
            </div>

            <div className={`p-2.5 rounded-lg border ${simulationStep === 'record_order' ? 'bg-emerald-950/60 border-emerald-500' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Order Manager Component ➔ Database Component</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-7">
                Order Manager invokes <code className="text-emerald-300 font-mono">IDataStore.saveCompletedOrder()</code> to record the order number and tokenized audit log in the local database.
              </p>
            </div>

            <div className={`p-2.5 rounded-lg border ${simulationStep === 'print_receipt' || simulationStep === 'order_complete' ? 'bg-purple-950/60 border-purple-500' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px]">4</span>
                <span>Order Manager Component ➔ Receipt Printer Component</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-7">
                Order Manager dispatches receipt template via <code className="text-purple-300 font-mono">IReceiptPrint.printReceipt()</code>. The hardware driver spools ESC/POS commands to print the paper receipt.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
