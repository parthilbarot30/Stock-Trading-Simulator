import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, price) => {},
  openSellWindow: (uid, price) => {},
  closeBuyWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStockPrice, setSelectedStockPrice] = useState(0);
  const [orderMode, setOrderMode] = useState("BUY");

  const handleOpenBuyWindow = (uid, price = 0) => {
    setOrderMode("BUY");
    setSelectedStockUID(uid);
    setSelectedStockPrice(price);
    setIsWindowOpen(true);
  };

  const handleOpenSellWindow = (uid, price = 0) => {
    setOrderMode("SELL");
    setSelectedStockUID(uid);
    setSelectedStockPrice(price);
    setIsWindowOpen(true);
  };

  const handleCloseWindow = () => {
    setIsWindowOpen(false);
    setSelectedStockUID("");
    setSelectedStockPrice(0);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeBuyWindow: handleCloseWindow,
      }}
    >
      {props.children}
      {isWindowOpen && (
        <BuyActionWindow
          uid={selectedStockUID}
          marketPrice={selectedStockPrice}
          mode={orderMode}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;