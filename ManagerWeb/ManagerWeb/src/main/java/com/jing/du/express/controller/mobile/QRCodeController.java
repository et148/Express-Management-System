package com.jing.du.express.controller.mobile;

import com.jing.du.express.decode.BaseEncode;
import com.jing.du.express.dto.QRCodeDTO;
import com.jing.du.express.dto.RetMsg;
import com.jing.du.express.entity.ExpressNo;
import com.jing.du.express.entity.User;
import com.jing.du.express.service.ExpressNoService;
import com.jing.du.express.service.UserService;
import com.jing.du.express.utils.QRCodeUtil;
import com.jing.du.express.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.File;

@Controller
@RequestMapping("/")
public class QRCodeController {
    public static final int width = 300;
    public static final int height = 300;
    public static final String FORMAT = "png";

    @Autowired
    private ExpressNoService expressNoService;
    @Autowired
    private UserService userService;

    @RequestMapping("/getUserInfo")
    @ResponseBody
    public Object getUserInfo(HttpServletRequest request, @Valid QRCodeDTO qrCodeDTO) {
        if (StringUtils.isNotEmpty(qrCodeDTO.getExpressNoId()) &&
                StringUtils.isNotEmpty(qrCodeDTO.getMessagerId())) {
            try {
                String id = BaseEncode.decrypt_Base64(qrCodeDTO.getExpressNoId());
                ExpressNo expressNo = expressNoService.getExpressNo(id);
                if (expressNo != null && expressNo.getMessagerId().equals(qrCodeDTO.getMessagerId())) {
                    String buyerId = expressNo.getBuyerId();
                    if(StringUtils.isNotEmpty(buyerId)){
                        User user = userService.getById(buyerId);
                        return RetMsg.success(user);
                    }
                } else {
                    return RetMsg.failure("没有权限查看");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return RetMsg.failure("参数绑定错误");
    }

    @RequestMapping("/generateQRCode")
    @ResponseBody
    public Object generateQRCode(HttpServletRequest request, @Valid QRCodeDTO qrCodeDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return RetMsg.failure("参数绑定错误");
        } else {
            if (StringUtils.isNotEmpty(qrCodeDTO.getExpressNoId())) {
                //编码
                try {
                    String encodeStr = BaseEncode.encrypt_Base64(qrCodeDTO.getExpressNoId());

                    String suffix = ".png";
                    String currentPath = QRCodeController.class.getClassLoader().getResource("static").getPath();
                    String fileName = currentPath + File.separator +"qrcode/"+ encodeStr + suffix;
                    if(new File(fileName).exists()){
                        return RetMsg.success("/qrcode"+File.separator+encodeStr+suffix);
                    }
                    QRCodeUtil.generateQRCode(encodeStr, width, height, FORMAT, fileName);
                    return RetMsg.success("/qrcode"+File.separator+encodeStr+suffix);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            return RetMsg.failure("参数绑定错误");
        }
    }
}
