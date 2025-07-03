import React, { useState, useEffect } from 'react';
import { FileText, Lightbulb } from 'lucide-react';

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
        <h3 className="text-lg font-semibold text-gray-800">Document Preview</h3>
        
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {filePreview ? (
                <img 
                  src={filePreview} 
                  alt="Document preview" 
                  className="w-16 h-16 object-cover rounded-md border"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <FileText size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <p className="font-medium text-gray-800 truncate">{file.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Controls & Suggestion */}
      <div className="space-y-6">
        {/* AI Suggestion Box */}
        {showSuggestion && (
          <div className="bg-suggestion-bg border-l-4 border-suggestion-border p-4 rounded-md">
            <div className="flex items-start space-x-3">
              <Lightbulb size={20} className="text-suggestion-border mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">AI Suggestion</p>
                <p className="text-sm text-gray-700 mt-1">
                  This document appears to be an <strong>Invoice</strong>. We recommend using the 'Invoice' model for the best results.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Model Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Select Processing Model
          </label>
          <select
            value={selectedModel}
            onChange={handleModelChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doc-primary focus:border-transparent bg-white"
          >
            <option disabled value="">-- Choose a model --</option>
            
            <optgroup label="General Purpose">
              <option value="document_conversion">Document Conversion</option>
              <option value="image_to_text">Image to Text Extraction</option>
            </optgroup>
            
            <optgroup label="Accounts Payable">
              <option value="invoice">Invoice</option>
              <option value="purchase_order">Purchase Order</option>
              <option value="remittance_advice">Remittance Advice</option>
            </optgroup>
            
            <optgroup label="Expense Management">
              <option value="receipt">Receipt</option>
              <option value="hotel_invoice">Hotel Invoice</option>
              <option value="taxi_receipt">Taxi Receipt</option>
              <option value="utility_bill">Utility Bill</option>
            </optgroup>
            
            <optgroup label="Know Your Customer (KYC)">
              <option value="us_form_1040">US Form 1040</option>
              <option value="us_form_w2">US Form W-2</option>
              <option value="bank_statement">Bank Statement</option>
              <option value="personal_earnings_statement">Personal Earnings Statement</option>
            </optgroup>
            
            <optgroup label="Logistics & Customs">
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
            
            <optgroup label="Contracts & Financial">
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
            w-full py-3 px-6 rounded-lg font-medium transition-colors
            ${selectedModel 
              ? 'bg-doc-primary hover:bg-doc-primary-hover text-white cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Process Document
        </button>
      </div>
    </div>
  );
};

export default DocumentAnalysis;