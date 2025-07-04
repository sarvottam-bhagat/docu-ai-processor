import React, { useState, useEffect } from 'react';
import { FileText, Lightbulb } from 'lucide-react';
import { abbyyService } from '../services/abbyyService';

interface DocumentAnalysisProps {
  file: File;
  onModelSelect: (model: string) => void;
  onProcess: () => void;
  showSuggestion: boolean;
}

const DocumentAnalysis: React.FC<DocumentAnalysisProps> = ({ 
  file, 
  onModelSelect, 
  onProcess, 
  showSuggestion 
}) => {
  const [selectedModel, setSelectedModel] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value;
    setSelectedModel(model);
    onModelSelect(model);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left Column: Document Preview */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">📄 Document Preview</h3>
        
        <div className="border border-card-border rounded-xl p-6 bg-card-bg/30 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {filePreview ? (
                <img 
                  src={filePreview} 
                  alt="Document preview" 
                  className="w-20 h-20 object-cover rounded-lg border border-doc-primary/30 shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-doc-primary/20 to-doc-secondary/20 rounded-lg flex items-center justify-center border border-doc-primary/30">
                  <FileText size={32} className="text-doc-primary" />
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <p className="font-semibold text-foreground truncate text-lg">{file.name}</p>
              <p className="text-foreground/70 font-medium">{formatFileSize(file.size)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Controls & Suggestion */}
      <div className="space-y-6">
        {/* AI Suggestion Box */}
        {showSuggestion && (
          <div className="bg-suggestion-bg/50 border border-suggestion-border/50 p-6 rounded-xl backdrop-blur-sm relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-doc-primary/10 to-doc-secondary/10"></div>
            <div className="relative z-10 flex items-start space-x-4">
              <Lightbulb size={24} className="text-doc-primary mt-1 flex-shrink-0 animate-pulse" />
              <div>
                <p className="text-lg font-semibold text-foreground mb-2">🤖 AI Suggestion</p>
                <p className="text-foreground/80">
                  This document appears to be an <span className="text-doc-primary font-semibold">Invoice</span>. We recommend using the 'Invoice' model for the best results! ✨
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Model Selection */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-foreground">
            🎯 Select Processing Model
          </label>
          <select
            value={selectedModel}
            onChange={handleModelChange}
            className="w-full p-4 border border-card-border rounded-xl focus:ring-2 focus:ring-doc-primary focus:border-doc-primary bg-card-bg/30 backdrop-blur-sm text-foreground font-medium transition-all duration-300"
          >
            <option disabled value="">-- Choose a model --</option>
            
            <optgroup label="🔧 General Purpose">
              <option value="document_conversion">Document Conversion</option>
              <option value="image_to_text">Image to Text Extraction</option>
            </optgroup>
            
            <optgroup label="💼 Accounts Payable">
              <option value="invoice">Invoice</option>
              <option value="purchase_order">Purchase Order</option>
              <option value="remittance_advice">Remittance Advice</option>
            </optgroup>
            
            <optgroup label="💳 Expense Management">
              <option value="receipt">Receipt</option>
              <option value="hotel_invoice">Hotel Invoice</option>
              <option value="taxi_receipt">Taxi Receipt</option>
              <option value="utility_bill">Utility Bill</option>
            </optgroup>
            
            <optgroup label="🔍 Know Your Customer (KYC)">
              <option value="us_form_1040">US Form 1040</option>
              <option value="us_form_w2">US Form W-2</option>
              <option value="bank_statement">Bank Statement</option>
              <option value="personal_earnings_statement">Personal Earnings Statement</option>
            </optgroup>
            
            <optgroup label="🚚 Logistics & Customs">
              <option value="air_waybill">Air Waybill</option>
              <option value="arrival_notice">Arrival Notice</option>
              <option value="bill_of_lading">Bill of Lading</option>
              <option value="certificate_of_origin">Certificate of Origin</option>
              <option value="commercial_invoice">Commercial Invoice</option>
              <option value="customs_declaration">Customs Declaration (EU)</option>
              <option value="dangerous_goods_declaration">Dangerous Goods Declaration</option>
              <option value="delivery_note">Delivery Note</option>
              <option value="international_consignment_note">International Consignment Note</option>
              <option value="packing_list">Packing List</option>
              <option value="sea_waybill">Sea Waybill</option>
            </optgroup>
            
            <optgroup label="📋 Contracts & Financial">
              <option value="basic_contract">Basic Contract</option>
              <option value="brokerage_statement">Brokerage Statement</option>
            </optgroup>
          </select>
        </div>

        {/* Process Button */}
        <button
          onClick={onProcess}
          disabled={!selectedModel}
          className={`
            w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform relative overflow-hidden
            ${selectedModel 
              ? 'bg-gradient-to-r from-doc-primary to-doc-secondary hover:from-doc-primary-hover hover:to-doc-secondary text-white cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-doc-primary/25' 
              : 'bg-gray-600/30 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {selectedModel ? '🚀 Process Document' : '⚡ Select a Model First'}
        </button>
      </div>
    </div>
  );
};

export default DocumentAnalysis;