import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Document, Page, pdfjs } from "react-pdf";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { pdfFileState } from "../recoil/atoms";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface PDFReaderProps {
  pageNumber: number;
}

const PDFReader: React.FC<PDFReaderProps> = ({ pageNumber }) => {
  const pdfFile = useRecoilValue(pdfFileState);
  const [numPages, setNumPages] = useState<number>(1);
  const [pageHeights, setPageHeights] = useState<number[]>([]);
  const listRef = useRef<List>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageHeights(new Array(numPages).fill(0));
  };

  const onPageRenderSuccess = useCallback((page: any) => {
    const { pageIndex, height } = page;
    // setPageHeights(prevHeights => {
    //   const newHeights = [...prevHeights];
    //   newHeights[pageIndex] = height;
    //   return newHeights;
    // });
  }, []);

  // useEffect(()=>{
  //   console.log(pageHeights,'pageHeightspageHeightspageHeights')
  // },[pageHeights])

  useEffect(() => {
    if (listRef.current && numPages) {
      const scrollToIndex = Math.min(pageNumber - 1, numPages - 1);
      listRef.current.scrollToItem(scrollToIndex, "start");
    }
  }, [pageNumber, numPages]);

  const PageWrapper = ({ index }: { index: number; }) => {
    console.log(index,'dfsdadf')
    return (
      <div className="max-w-full h-auto">
      <Page
        pageNumber={index + 1}
        onRenderSuccess={onPageRenderSuccess}
        width={window.innerWidth * 0.9} // 90% of window width
      />
    </div>
    )
  }

  const getItemSize = (index: number) => pageHeights[index] || 800; // Default height

  return (
    <div className="container mx-auto p-4 h-screen">
      {pdfFile && (
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          className="border border-gray-300 rounded"
        >
          <AutoSizer>
              {({ height, width }) => (
                <List
                  ref={listRef}
                  height={height}
                  itemCount={numPages}
                  itemSize={getItemSize}
                  width={width}
                  overscanCount={2} // Load 2 pages above and below
                  initialScrollOffset={getItemSize(pageNumber - 1)}
                >
                  {PageWrapper}
                </List>
              )}
            </AutoSizer>
        </Document>
      )}
    </div>
  );
};

export default PDFReader;