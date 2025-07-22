import React from 'react'
import { PreviewCard } from '../Component'

const ShortCutKeys = ({ Save = true, Reload = true, Reset = true }) => {
    return (
        <>
            <PreviewCard >
                <div style={{ display: "flex", gap: "10px", cursor: "default" }}>
                    {Save && (
                        <div style={{
                            padding: "5px 10px",
                            backgroundColor: "#96e691",
                            color: "#000",
                            borderRadius: "5px",
                            border: "1px solid #22bb33"
                        }}
                        >Save [ctrl+s]</div>
                    )}
                    {Reload && (
                        <div style={{
                            padding: "5px 10px",
                            backgroundColor: "#99c2ff",
                            color: "#000",
                            borderRadius: "5px",
                            border: "1px solid #1a75ff"
                        }}
                        >Reload [ctrl+r]</div>
                    )}
                    {Reset && (
                        <div style={{
                            padding: "5px 10px",
                            backgroundColor: "#d9b3ff",
                            color: "#000",
                            borderRadius: "5px",
                            border: "1px solid #b366ff"
                        }}
                        >Reset [ctrl+l]</div>
                    )}
                    
                </div>
            </PreviewCard>
        </>
    )
}

export default ShortCutKeys