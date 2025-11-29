package com.ilanzgx.demo.modules.dividend.domain;

import com.ilanzgx.demo.modules.dividend.application.dto.UserDividendsResponse;

public interface DividendService {
    UserDividendsResponse getAllUserDividends(String userId);
}
