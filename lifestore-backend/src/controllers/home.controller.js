function _0x390e(){const _0x136aa7=['737fsFzdq','29185KFNRsv','aggregate','2545566yEiwxu','_id','$storePayment','$agentCommission','1970-01-01','exports','collation','catch','json','agentCommission','en_US','user','24NIOskf','status','2481750YwyPuQ','296916HWXzoT','T23:59:59.999+05:30','$totalCommission','184958WdSvTp','$agentPayment','query','storeCommission','pendingStoreCommission','pendingAgentCommission','5843330WVgDsw','4lHbqXs','filter','../models/customer.model','count','endDate','../models/commission.model','express-async-handler','280cpgfuK','880838TToBnE','lifeStoreIncome','T00:00:00.000+05:30','$amount','startDate','66KpVNza'];_0x390e=function(){return _0x136aa7;};return _0x390e();}const _0xed6a86=_0x40ec;(function(_0x1b79cf,_0x4db936){const _0x36f1ca=_0x40ec,_0x5f6d16=_0x1b79cf();while(!![]){try{const _0x52dd63=-parseInt(_0x36f1ca(0x1b6))/0x1*(-parseInt(_0x36f1ca(0x1af))/0x2)+parseInt(_0x36f1ca(0x1c7))/0x3+parseInt(_0x36f1ca(0x1bd))/0x4*(-parseInt(_0x36f1ca(0x1c5))/0x5)+parseInt(_0x36f1ca(0x1c3))/0x6*(-parseInt(_0x36f1ca(0x1be))/0x7)+parseInt(_0x36f1ca(0x1a9))/0x8*(-parseInt(_0x36f1ca(0x1ab))/0x9)+parseInt(_0x36f1ca(0x1b5))/0xa+-parseInt(_0x36f1ca(0x1c4))/0xb*(-parseInt(_0x36f1ca(0x1ac))/0xc);if(_0x52dd63===_0x4db936)break;else _0x5f6d16['push'](_0x5f6d16['shift']());}catch(_0x3cbe76){_0x5f6d16['push'](_0x5f6d16['shift']());}}}(_0x390e,0xcd35a));const asyncHandler=require(_0xed6a86(0x1bc)),Commission=require(_0xed6a86(0x1bb)),mongoose=require('mongoose'),{MyCustomError}=require('../middlewares/error/error.handler'),customerModel=require(_0xed6a86(0x1b8)),getHomeData=asyncHandler(async(_0xf98917,_0x10883a,_0x13fa86)=>{const _0x49682c=_0xed6a86;try{const _0xd71ac4=_0xf98917[_0x49682c(0x1b1)][_0x49682c(0x1c2)]?new Date(_0xf98917[_0x49682c(0x1b1)][_0x49682c(0x1c2)]+_0x49682c(0x1c0)):new Date(_0x49682c(0x1cb)),_0x562239=_0xf98917[_0x49682c(0x1b1)][_0x49682c(0x1ba)]?new Date(_0xf98917[_0x49682c(0x1b1)][_0x49682c(0x1ba)]+_0x49682c(0x1ad)):new Date(),_0x339cc9=[{'$match':{'issueDate':{'$gte':_0xd71ac4,'$lt':_0x562239}}},{'$group':{'_id':null,'pendingStoreCommission':{'$sum':{'$cond':{'if':{'$ifNull':[_0x49682c(0x1c9),![]]},'then':0x0,'else':'$totalCommission'}}},'pendingAgentCommission':{'$sum':{'$cond':{'if':{'$ifNull':[_0x49682c(0x1b0),![]]},'then':0x0,'else':'$agentCommission'}}},'lifeStoreIncome':{'$sum':{'$subtract':[_0x49682c(0x1ae),_0x49682c(0x1ca)]}}}}],_0x35ec45=await Promise['all']([Commission[_0x49682c(0x1c6)](_0x339cc9['filter'](_0x261318=>!!_0x261318))[_0x49682c(0x1a3)]({'locale':_0x49682c(0x1a7),'numericOrdering':!![]}),customerModel['count']({'createdAt':{'$gte':_0xd71ac4,'$lt':_0x562239}})])[_0x49682c(0x1a4)](_0x4aed71=>{throw new MyCustomError(0x1f4,_0x4aed71);});_0x10883a[_0x49682c(0x1aa)](0xc8)[_0x49682c(0x1a5)]({'pendingStoreCommission':_0x35ec45[0x0][0x0]?.[_0x49682c(0x1b3)]||0x0,'pendingAgentCommission':_0x35ec45[0x0][0x0]?.[_0x49682c(0x1b4)]||0x0,'lifeStoreIncome':_0x35ec45[0x0][0x0]?.[_0x49682c(0x1bf)]||0x0,'storeCommission':_0x35ec45[0x0][0x0]?.[_0x49682c(0x1b2)]||0x0,'agentCommission':_0x35ec45[0x0][0x0]?.['agentCommission']||0x0,'customers':_0x35ec45[0x1]||0x0});}catch(_0x296b78){_0x13fa86(_0x296b78);}}),getAgentHomeData=asyncHandler(async(_0xf786a1,_0x454e5e,_0x59d4f9)=>{const _0x5312f1=_0xed6a86;try{const _0xd76a9e=_0xf786a1[_0x5312f1(0x1b1)]['startDate']?new Date(_0xf786a1['query']['startDate']+_0x5312f1(0x1c0)):new Date(_0x5312f1(0x1cb)),_0x21f31b=_0xf786a1[_0x5312f1(0x1b1)]['endDate']?new Date(_0xf786a1[_0x5312f1(0x1b1)][_0x5312f1(0x1ba)]+_0x5312f1(0x1ad)):new Date(),_0xf4f49f=[{'$match':{'issueDate':{'$gte':_0xd76a9e,'$lt':_0x21f31b},'agent':_0xf786a1[_0x5312f1(0x1a8)]['_id']}},{'$group':{'_id':null,'pendingAgentCommission':{'$sum':{'$cond':{'if':{'$ifNull':[_0x5312f1(0x1b0),![]]},'then':0x0,'else':'$agentCommission'}}},'agentCommission':{'$sum':_0x5312f1(0x1ca)}}}],_0x4cac9b=await Promise['all']([Commission['aggregate'](_0xf4f49f[_0x5312f1(0x1b7)](_0xa6c021=>!!_0xa6c021))[_0x5312f1(0x1a3)]({'locale':_0x5312f1(0x1a7),'numericOrdering':!![]}),customerModel[_0x5312f1(0x1b9)]({'createdAt':{'$gte':_0xd76a9e,'$lt':_0x21f31b},'agent':_0xf786a1[_0x5312f1(0x1a8)][_0x5312f1(0x1c8)]})])['catch'](_0xfffdc9=>{throw new MyCustomError(0x1f4,_0xfffdc9);});_0x454e5e[_0x5312f1(0x1aa)](0xc8)['json']({'pendingAgentCommission':_0x4cac9b[0x0][0x0]?.[_0x5312f1(0x1b4)]||0x0,'totalCommission':_0x4cac9b[0x0][0x0]?.[_0x5312f1(0x1a6)]||0x0,'customers':_0x4cac9b[0x1]||0x0});}catch(_0x402207){_0x59d4f9(_0x402207);}}),getStoreHomeData=asyncHandler(async(_0xb1253e,_0x868491,_0x32014d)=>{const _0x39325b=_0xed6a86;try{const _0x2e07b8=_0xb1253e['query'][_0x39325b(0x1c2)]?new Date(_0xb1253e[_0x39325b(0x1b1)][_0x39325b(0x1c2)]+_0x39325b(0x1c0)):new Date('1970-01-01'),_0x1b7355=_0xb1253e[_0x39325b(0x1b1)][_0x39325b(0x1ba)]?new Date(_0xb1253e['query'][_0x39325b(0x1ba)]+'T23:59:59.999+05:30'):new Date(),_0x1d1239=[{'$match':{'issueDate':{'$gte':_0x2e07b8,'$lt':_0x1b7355},'store':_0xb1253e[_0x39325b(0x1a8)][_0x39325b(0x1c8)]}},{'$group':{'_id':null,'pendingCommission':{'$sum':{'$cond':{'if':{'$ifNull':[_0x39325b(0x1c9),![]]},'else':_0x39325b(0x1ae),'then':0x0}}},'totalSales':{'$sum':_0x39325b(0x1c1)},'totalInvoiceNumber':{'$count':{}}}}],_0x5619f2=await Commission[_0x39325b(0x1c6)](_0x1d1239[_0x39325b(0x1b7)](_0x283748=>!!_0x283748))[_0x39325b(0x1a3)]({'locale':'en_US','numericOrdering':!![]});_0x868491['status'](0xc8)[_0x39325b(0x1a5)]({..._0x5619f2[0x0]});}catch(_0x4ccae6){_0x32014d(_0x4ccae6);}});function _0x40ec(_0x54c01b,_0x56e9e0){const _0x390e4b=_0x390e();return _0x40ec=function(_0x40ecab,_0x54b24e){_0x40ecab=_0x40ecab-0x1a3;let _0x5389b7=_0x390e4b[_0x40ecab];return _0x5389b7;},_0x40ec(_0x54c01b,_0x56e9e0);}module[_0xed6a86(0x1cc)]={'getHomeData':getHomeData,'getAgentHomeData':getAgentHomeData,'getStoreHomeData':getStoreHomeData};