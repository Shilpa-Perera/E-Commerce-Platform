import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVariantById } from "../services/variantService";

function VariantImages(props) {
    const { id: variantId } = useParams();
    const push = useNavigate();
    const replace = (path) => push(path, { replace: true });
    const [variant, setVariant] = useState(null);

    useEffect ( () => {
        const fetchData = async () => {
            try {
                const { data } = await getVariantById(variantId);
                setVariant(data);
            } catch (e) {
                if (e.response && e.response.status === 404)
                    replace("/not-found");
            }
        }
        fetchData();
    })

    if (variant === null) return;

    const { variant_name } = variant;

    return (
        <div>
            <h1>{variant_name}</h1>
        </div>
    );
}

export default VariantImages;