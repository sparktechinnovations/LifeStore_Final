const _0x3e54eb=_0x8619;function _0x8619(_0x537c8d,_0x4d2496){const _0xf4fb92=_0xf4fb();return _0x8619=function(_0x8619b9,_0x410a4c){_0x8619b9=_0x8619b9-0x1d7;let _0x420e14=_0xf4fb92[_0x8619b9];return _0x420e14;},_0x8619(_0x537c8d,_0x4d2496);}function _0xf4fb(){const _0x4f0f3c=['4XHBAEV','Agent','24SdJPaH','466330THNqgh','Schema','2758OmLHep','10986Swcymq','ObjectId','Types','2669814GbrIvP','model','7438519lUBaix','Commission','Customer','702LLVxFE','3178068tdcLhS','mongoose','10oavxEB','now','52OxisEp','3652205rpbCmg','813qbnuao','AgentPayment'];_0xf4fb=function(){return _0x4f0f3c;};return _0xf4fb();}(function(_0x1adad6,_0x17528e){const _0x5c6eff=_0x8619,_0x570ff9=_0x1adad6();while(!![]){try{const _0x545d6b=-parseInt(_0x5c6eff(0x1e3))/0x1+-parseInt(_0x5c6eff(0x1d7))/0x2*(-parseInt(_0x5c6eff(0x1de))/0x3)+parseInt(_0x5c6eff(0x1e0))/0x4*(-parseInt(_0x5c6eff(0x1dd))/0x5)+-parseInt(_0x5c6eff(0x1e6))/0x6*(-parseInt(_0x5c6eff(0x1e5))/0x7)+-parseInt(_0x5c6eff(0x1e2))/0x8*(parseInt(_0x5c6eff(0x1e9))/0x9)+-parseInt(_0x5c6eff(0x1da))/0xa*(-parseInt(_0x5c6eff(0x1eb))/0xb)+-parseInt(_0x5c6eff(0x1d8))/0xc*(-parseInt(_0x5c6eff(0x1dc))/0xd);if(_0x545d6b===_0x17528e)break;else _0x570ff9['push'](_0x570ff9['shift']());}catch(_0x279d4e){_0x570ff9['push'](_0x570ff9['shift']());}}}(_0xf4fb,0x71a03));const mongoose=require(_0x3e54eb(0x1d9)),commissionSchema=new mongoose[(_0x3e54eb(0x1e4))]({'invoiceNum':{'type':String,'required':!![]},'agent':{'type':mongoose[_0x3e54eb(0x1e4)][_0x3e54eb(0x1e8)][_0x3e54eb(0x1e7)],'ref':_0x3e54eb(0x1e1),'required':!![]},'store':{'type':mongoose[_0x3e54eb(0x1e4)][_0x3e54eb(0x1e8)][_0x3e54eb(0x1e7)],'ref':'Store','required':!![]},'customer':{'type':mongoose[_0x3e54eb(0x1e4)]['Types'][_0x3e54eb(0x1e7)],'ref':_0x3e54eb(0x1ed),'required':!![]},'amount':{'type':Number,'required':!![]},'storePayment':{'type':mongoose['Schema'][_0x3e54eb(0x1e8)][_0x3e54eb(0x1e7)],'ref':'StorePayment'},'agentPayment':{'type':mongoose[_0x3e54eb(0x1e4)]['Types'][_0x3e54eb(0x1e7)],'ref':_0x3e54eb(0x1df)},'agentCommission':{'type':Number,'required':!![]},'totalCommission':{'type':Number,'required':!![]},'issueDate':{'type':Date,'default':Date[_0x3e54eb(0x1db)]}},{'timestamps':!![]});module['exports']=mongoose[_0x3e54eb(0x1ea)](_0x3e54eb(0x1ec),commissionSchema);