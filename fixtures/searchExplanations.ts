/* eslint-disable max-len */

export default {
    housing: {
        "description": "sum of:",
        "details": [
            {
                "description": "function score, product of:",
                "details": [
                    {
                        "description": "product of:",
                        "details": [
                            {
                                "description": "sum of:",
                                "details": [
                                    {
                                        "description": "weight(crisis_flags:hous in 147440) [PerFieldSimilarity], result of:",
                                        "details": [
                                            {
                                                "description": "score(doc=147440,freq=1.0), product of:",
                                                "details": [
                                                    {
                                                        "description": "queryWeight, product of:",
                                                        "details": [
                                                            {
                                                                "description": "idf(docFreq=9, maxDocs=741390)",
                                                                "value": 12.213697,
                                                            },
                                                            {
                                                                "description": "queryNorm",
                                                                "value": 0.05058913,
                                                            },
                                                        ],
                                                        "value": 0.61788034,
                                                    },
                                                    {
                                                        "description": "fieldWeight in 147440, product of:",
                                                        "details": [
                                                            {
                                                                "description": "tf(freq=1.0), with freq of:",
                                                                "details": [
                                                                    {
                                                                        "description": "termFreq=1.0",
                                                                        "value": 1.0,
                                                                    },
                                                                ],
                                                                "value": 1.0,
                                                            },
                                                            {
                                                                "description": "idf(docFreq=9, maxDocs=741390)",
                                                                "value": 12.213697,
                                                            },
                                                            {
                                                                "description": "fieldNorm(doc=147440)",
                                                                "value": 0.4375,
                                                            },
                                                        ],
                                                        "value": 5.3434925,
                                                    },
                                                ],
                                                "value": 3.301639,
                                            },
                                        ],
                                        "value": 3.301639,
                                    },
                                ],
                                "value": 3.301639,
                            },
                            {
                                "description": "coord(1/2)",
                                "value": 0.5,
                            },
                        ],
                        "value": 1.6508195,
                    },
                    {
                        "description": "Math.min of",
                        "details": [
                            {
                                "description": "function score, score mode [sum]",
                                "details": [
                                    {
                                        "description": "function score, product of:",
                                        "details": [
                                            {
                                                "description": "match filter: cache(BooleanFilter(_field_names:location_private.point_query))",
                                                "value": 1.0,
                                            },
                                            {
                                                "description": "Function for field location_private.point_query:",
                                                "details": [
                                                    {
                                                        "description": "exp(- MIN of: [Math.max(arcDistance([-37.816013, 144.959278](=doc value),[-37.744869347378064, 144.96429817260335](=origin)) - 0.0(=offset), 0)] * 1.3862943611198905E-4)",
                                                        "value": 0.33346075,
                                                    },
                                                ],
                                                "value": 0.33346075,
                                            },
                                        ],
                                        "value": 0.33346075,
                                    },
                                    {
                                        "description": "function score, product of:",
                                        "details": [
                                            {
                                                "description": "match filter: cache(BooleanFilter(_field_names:location_private.point_query))",
                                                "value": 1.0,
                                            },
                                            {
                                                "description": "Function for field location_private.point_query:",
                                                "details": [
                                                    {
                                                        "description": "exp(- MIN of: [Math.max(arcDistance([-37.816013, 144.959278](=doc value),[-37.744869347378064, 144.96429817260335](=origin)) - 0.0(=offset), 0)] * 3.4657359027997264E-5)",
                                                        "value": 0.75990826,
                                                    },
                                                ],
                                                "value": 0.75990826,
                                            },
                                        ],
                                        "value": 0.75990826,
                                    },
                                    {
                                        "description": "function score, product of:",
                                        "details": [
                                            {
                                                "description": "match filter: cache(BooleanFilter(_field_names:location_private.point_query))",
                                                "value": 1.0,
                                            },
                                            {
                                                "description": "Function for field location_private.point_query:",
                                                "details": [
                                                    {
                                                        "description": "exp(- MIN of: [Math.max(arcDistance([-37.816013, 144.959278](=doc value),[-37.744869347378064, 144.96429817260335](=origin)) - 0.0(=offset), 0)] * 1.7328679513998631E-6)",
                                                        "value": 0.9863659,
                                                    },
                                                ],
                                                "value": 0.9863659,
                                            },
                                        ],
                                        "value": 0.9863659,
                                    },
                                    {
                                        "description": "function score, product of:",
                                        "details": [
                                            {
                                                "description": "match filter: org.apache.lucene.spatial.prefix.IntersectsPrefixTreeFilter@478114d",
                                                "value": 1.0,
                                            },
                                            {
                                                "description": "product of:",
                                                "details": [
                                                    {
                                                        "description": "constant score 1.0 - no function provided",
                                                        "value": 1.0,
                                                    },
                                                    {
                                                        "description": "weight",
                                                        "value": 1.2,
                                                    },
                                                ],
                                                "value": 1.2,
                                            },
                                        ],
                                        "value": 1.2,
                                    },
                                    {
                                        "description": "function score, product of:",
                                        "details": [
                                            {
                                                "description": "match filter: QueryWrapperFilter(filtered(crisis_flags:hous)->NotFilter(cache(BooleanFilter(_field_names:catchment_mpoly))) org.apache.lucene.spatial.prefix.IntersectsPrefixTreeFilter@f5704b33)",
                                                "value": 1.0,
                                            },
                                            {
                                                "description": "product of:",
                                                "details": [
                                                    {
                                                        "description": "constant score 1.0 - no function provided",
                                                        "value": 1.0,
                                                    },
                                                    {
                                                        "description": "weight",
                                                        "value": 200.0,
                                                    },
                                                ],
                                                "value": 200.0,
                                            },
                                        ],
                                        "value": 200.0,
                                    },
                                ],
                                "value": 203.27974,
                            },
                            {
                                "description": "maxBoost",
                                "value": 3.4028235e+38,
                            },
                        ],
                        "value": 203.27974,
                    },
                    {
                        "description": "queryBoost",
                        "value": 1.0,
                    },
                ],
                "value": 335.57816,
            },
            {
                "description": "function score, product of:",
                "details": [
                    {
                        "description": "sum of:",
                        "details": [
                            {
                                "description": "weight(service_types:hous in 147440) [PerFieldSimilarity], result of:",
                                "details": [
                                    {
                                        "description": "score(doc=147440,freq=2.0), product of:",
                                        "details": [
                                            {
                                                "description": "queryWeight, product of:",
                                                "details": [
                                                    {
                                                        "description": "idf(docFreq=2933, maxDocs=741390)",
                                                        "value": 6.5321603,
                                                    },
                                                    {
                                                        "description": "queryNorm",
                                                        "value": 0.05058913,
                                                    },
                                                ],
                                                "value": 0.3304563,
                                            },
                                            {
                                                "description": "fieldWeight in 147440, product of:",
                                                "details": [
                                                    {
                                                        "description": "tf(freq=2.0), with freq of:",
                                                        "details": [
                                                            {
                                                                "description": "termFreq=2.0",
                                                                "value": 2.0,
                                                            },
                                                        ],
                                                        "value": 1.4142135,
                                                    },
                                                    {
                                                        "description": "idf(docFreq=2933, maxDocs=741390)",
                                                        "value": 6.5321603,
                                                    },
                                                    {
                                                        "description": "fieldNorm(doc=147440)",
                                                        "value": 0.5,
                                                    },
                                                ],
                                                "value": 4.6189346,
                                            },
                                        ],
                                        "value": 1.526356,
                                    },
                                ],
                                "value": 1.526356,
                            },
                            {
                                "description": "weight(crisis_flags:hous in 147440) [PerFieldSimilarity], result of:",
                                "details": [
                                    {
                                        "description": "score(doc=147440,freq=1.0), product of:",
                                        "details": [
                                            {
                                                "description": "queryWeight, product of:",
                                                "details": [
                                                    {
                                                        "description": "idf(docFreq=9, maxDocs=741390)",
                                                        "value": 12.213697,
                                                    },
                                                    {
                                                        "description": "queryNorm",
                                                        "value": 0.05058913,
                                                    },
                                                ],
                                                "value": 0.61788034,
                                            },
                                            {
                                                "description": "fieldWeight in 147440, product of:",
                                                "details": [
                                                    {
                                                        "description": "tf(freq=1.0), with freq of:",
                                                        "details": [
                                                            {
                                                                "description": "termFreq=1.0",
                                                                "value": 1.0,
                                                            },
                                                        ],
                                                        "value": 1.0,
                                                    },
                                                    {
                                                        "description": "idf(docFreq=9, maxDocs=741390)",
                                                        "value": 12.213697,
                                                    },
                                                    {
                                                        "description": "fieldNorm(doc=147440)",
                                                        "value": 0.4375,
                                                    },
                                                ],
                                                "value": 5.3434925,
                                            },
                                        ],
                                        "value": 3.301639,
                                    },
                                ],
                                "value": 3.301639,
                            },
                        ],
                        "value": 4.8279953,
                    },
                    {
                        "description": "Math.min of",
                        "details": [
                            {
                                "description": "function score, score mode [sum]",
                                "details": [
                                    {
                                        "description": "function score, product of:",
                                        "details": [
                                            {
                                                "description": "match filter: cache(BooleanFilter(_field_names:location_private.point_query))",
                                                "value": 1.0,
                                            },
                                            {
                                                "description": "Function for field location_private.point_query:",
                                                "details": [
                                                    {
                                                        "description": "exp(- MIN of: [Math.max(arcDistance([-37.816013, 144.959278](=doc value),[-37.744869347378064, 144.96429817260335](=origin)) - 0.0(=offset), 0)] * 1.3862943611198905E-4)",
                                                        "value": 0.33346075,
                                                    },
                                                ],
                                                "value": 0.33346075,
                                            },
                                        ],
                                        "value": 0.33346075,
                                    },
                                    {
                                        "description": "function score, product of:",
                                        "details": [
                                            {
                                                "description": "match filter: cache(BooleanFilter(_field_names:location_private.point_query))",
                                                "value": 1.0,
                                            },
                                            {
                                                "description": "Function for field location_private.point_query:",
                                                "details": [
                                                    {
                                                        "description": "exp(- MIN of: [Math.max(arcDistance([-37.816013, 144.959278](=doc value),[-37.744869347378064, 144.96429817260335](=origin)) - 0.0(=offset), 0)] * 3.4657359027997264E-5)",
                                                        "value": 0.75990826,
                                                    },
                                                ],
                                                "value": 0.75990826,
                                            },
                                        ],
                                        "value": 0.75990826,
                                    },
                                    {
                                        "description": "function score, product of:",
                                        "details": [
                                            {
                                                "description": "match filter: cache(BooleanFilter(_field_names:location_private.point_query))",
                                                "value": 1.0,
                                            },
                                            {
                                                "description": "Function for field location_private.point_query:",
                                                "details": [
                                                    {
                                                        "description": "exp(- MIN of: [Math.max(arcDistance([-37.816013, 144.959278](=doc value),[-37.744869347378064, 144.96429817260335](=origin)) - 0.0(=offset), 0)] * 1.7328679513998631E-6)",
                                                        "value": 0.9863659,
                                                    },
                                                ],
                                                "value": 0.9863659,
                                            },
                                        ],
                                        "value": 0.9863659,
                                    },
                                    {
                                        "description": "function score, product of:",
                                        "details": [
                                            {
                                                "description": "match filter: org.apache.lucene.spatial.prefix.IntersectsPrefixTreeFilter@478114d",
                                                "value": 1.0,
                                            },
                                            {
                                                "description": "product of:",
                                                "details": [
                                                    {
                                                        "description": "constant score 1.0 - no function provided",
                                                        "value": 1.0,
                                                    },
                                                    {
                                                        "description": "weight",
                                                        "value": 1.2,
                                                    },
                                                ],
                                                "value": 1.2,
                                            },
                                        ],
                                        "value": 1.2,
                                    },
                                    {
                                        "description": "function score, product of:",
                                        "details": [
                                            {
                                                "description": "match filter: QueryWrapperFilter(filtered(crisis_flags:hous)->NotFilter(cache(BooleanFilter(_field_names:catchment_mpoly))) org.apache.lucene.spatial.prefix.IntersectsPrefixTreeFilter@f5704b33)",
                                                "value": 1.0,
                                            },
                                            {
                                                "description": "product of:",
                                                "details": [
                                                    {
                                                        "description": "constant score 1.0 - no function provided",
                                                        "value": 1.0,
                                                    },
                                                    {
                                                        "description": "weight",
                                                        "value": 200.0,
                                                    },
                                                ],
                                                "value": 200.0,
                                            },
                                        ],
                                        "value": 200.0,
                                    },
                                ],
                                "value": 203.27974,
                            },
                            {
                                "description": "maxBoost",
                                "value": 3.4028235e+38,
                            },
                        ],
                        "value": 203.27974,
                    },
                    {
                        "description": "queryBoost",
                        "value": 1.0,
                    },
                ],
                "value": 981.43365,
            },
            {
                "description": "weight(type:service in 147440) [PerFieldSimilarity], result of:",
                "details": [
                    {
                        "description": "score(doc=147440,freq=1.0), product of:",
                        "details": [
                            {
                                "description": "queryWeight, product of:",
                                "details": [
                                    {
                                        "description": "idf(docFreq=423430, maxDocs=741390)",
                                        "value": 1.5601362,
                                    },
                                    {
                                        "description": "queryNorm",
                                        "value": 0.05058913,
                                    },
                                ],
                                "value": 0.07892593,
                            },
                            {
                                "description": "fieldWeight in 147440, product of:",
                                "details": [
                                    {
                                        "description": "tf(freq=1.0), with freq of:",
                                        "details": [
                                            {
                                                "description": "termFreq=1.0",
                                                "value": 1.0,
                                            },
                                        ],
                                        "value": 1.0,
                                    },
                                    {
                                        "description": "idf(docFreq=423430, maxDocs=741390)",
                                        "value": 1.5601362,
                                    },
                                    {
                                        "description": "fieldNorm(doc=147440)",
                                        "value": 1.0,
                                    },
                                ],
                                "value": 1.5601362,
                            },
                        ],
                        "value": 0.1231352,
                    },
                ],
                "value": 0.1231352,
            },
        ],
        "value": 1317.135,
    },
}